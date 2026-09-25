"""A small, educational Defensive Investor screen inspired by Benjamin Graham.

This program is a learning example, not investment advice or a trading system.
It uses deliberately conservative, simplified screens.  Real financial decisions
need verified filings, context, tax considerations, and professional judgment.
"""

from __future__ import annotations

from dataclasses import dataclass
from math import sqrt
from typing import Iterable, Sequence


@dataclass(frozen=True)
class Asset:
    """Snapshot of the figures used in a conservative equity screen.

    All per-share values and price must be in the same currency.  `current_assets`
    and `total_debt` are absolute values, so only their ratio is used.
    """

    ticker: str
    price: float
    earnings_per_share: float
    book_value_per_share: float
    current_assets: float
    total_debt: float


@dataclass(frozen=True)
class DcaPurchase:
    period: int
    price: float
    contribution: float
    shares_bought: float
    total_shares: float


def dollar_cost_average(prices: Sequence[float], contribution: float) -> list[DcaPurchase]:
    """Invest the same cash amount at every period's closing price.

    This function never chooses a "good" entry date.  That is the point: a fixed,
    pre-committed rule removes a common route for fear and excitement to affect
    contribution timing.  Prices must be positive and contribution non-negative.
    """
    if contribution < 0:
        raise ValueError("contribution must be non-negative")
    if any(price <= 0 for price in prices):
        raise ValueError("all prices must be positive")

    total_shares = 0.0
    purchases: list[DcaPurchase] = []
    for period, price in enumerate(prices, start=1):
        shares = contribution / price
        total_shares += shares
        purchases.append(DcaPurchase(period, price, contribution, shares, total_shares))
    return purchases


def fundamental_metrics(asset: Asset) -> dict[str, float]:
    """Calculate Graham-style valuation and balance-sheet measures.

    The Graham Number is a classic heuristic: sqrt(22.5 * EPS * BVPS).  It is not
    a forecast and is intentionally used here only as a conservative reference
    value.  Loss-making or negative-book-value companies receive no estimate.
    """
    if asset.price <= 0 or asset.current_assets <= 0:
        raise ValueError("price and current assets must be positive")
    pe = asset.price / asset.earnings_per_share if asset.earnings_per_share > 0 else float("inf")
    pb = asset.price / asset.book_value_per_share if asset.book_value_per_share > 0 else float("inf")
    debt_to_current_assets = asset.total_debt / asset.current_assets
    intrinsic_value = (
        sqrt(22.5 * asset.earnings_per_share * asset.book_value_per_share)
        if asset.earnings_per_share > 0 and asset.book_value_per_share > 0
        else 0.0
    )
    margin_of_safety = (intrinsic_value - asset.price) / intrinsic_value if intrinsic_value else float("-inf")
    return {
        "pe": pe,
        "pb": pb,
        "debt_to_current_assets": debt_to_current_assets,
        "graham_number": intrinsic_value,
        "margin_of_safety": margin_of_safety,
    }


def qualifies_as_defensive(asset: Asset, required_discount: float = 0.30) -> tuple[bool, dict[str, float]]:
    """Return whether an asset passes a simplified, defensive Graham screen.

    Requirements: positive earnings and book value, P/E <= 15, P/B <= 1.5,
    P/E × P/B <= 22.5, total debt <= current assets, and the requested discount
    below the Graham Number.  A rejected asset is not necessarily a bad company;
    it simply does not meet this deliberately narrow policy.
    """
    if not 0 < required_discount < 1:
        raise ValueError("required_discount must be between 0 and 1")
    metrics = fundamental_metrics(asset)
    passes = (
        asset.earnings_per_share > 0
        and asset.book_value_per_share > 0
        and metrics["pe"] <= 15
        and metrics["pb"] <= 1.5
        and metrics["pe"] * metrics["pb"] <= 22.5
        and metrics["debt_to_current_assets"] <= 1
        and metrics["margin_of_safety"] >= required_discount
    )
    return passes, metrics


def defensive_pipeline(assets: Iterable[Asset], required_discount: float = 0.30) -> list[tuple[Asset, dict[str, float]]]:
    """Keep only assets meeting the pre-written defensive policy."""
    approved: list[tuple[Asset, dict[str, float]]] = []
    for asset in assets:
        passes, metrics = qualifies_as_defensive(asset, required_discount)
        if passes:
            approved.append((asset, metrics))
    return approved


if __name__ == "__main__":
    # Example data only; replace with validated company filings in real use.
    universe = [
        Asset("EXAMPLE_A", price=36, earnings_per_share=4, book_value_per_share=36, current_assets=120, total_debt=55),
        Asset("EXAMPLE_B", price=90, earnings_per_share=3, book_value_per_share=20, current_assets=100, total_debt=180),
    ]
    for asset, metrics in defensive_pipeline(universe):
        print(f"{asset.ticker}: approved at ${asset.price:.2f}; "
              f"Graham Number ${metrics['graham_number']:.2f}; "
              f"margin of safety {metrics['margin_of_safety']:.0%}")

    plan = dollar_cost_average([100, 80, 125, 95], contribution=250)
    print(f"DCA: {plan[-1].total_shares:.3f} shares after {len(plan)} fixed contributions")
