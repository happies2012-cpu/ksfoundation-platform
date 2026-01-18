
from typing import List, Dict, Optional
from pydantic import BaseModel
import asyncio

class ProductResult(BaseModel):
    title: str
    price: float
    currency: str
    store: str # amazon, flipkart, shopify
    url: str
    rating: float = 0.0

class CommerceService:
    """
    Aggregates product data from Amazon, Flipkart, and Shopify.
    """
    
    async def search_products(self, keyword: str) -> List[ProductResult]:
        """
        Unified search across e-commerce giants.
        """
        print(f"🛒 Commerce: Searching for '{keyword}' on Amazon, Flipkart, Shopify...")
        
        # Parallel Execution (Mock)
        results = await asyncio.gather(
            self._search_amazon(keyword),
            self._search_flipkart(keyword),
            self._search_shopify_aggregator(keyword)
        )
        
        # Flatten list
        flat_results = [item for sublist in results for item in sublist]
        # Sort by price ascending
        return sorted(flat_results, key=lambda x: x.price)

    async def _search_amazon(self, keyword: str) -> List[ProductResult]:
        # Mocking Amazon search
        base_price = 1000.0 if "laptop" in keyword.lower() else 50.0
        return [
            ProductResult(
                title=f"Amazon Basics {keyword}",
                price=base_price * 1.1,
                currency="INR",
                store="Amazon",
                url=f"https://amazon.in/s?k={keyword}",
                rating=4.2
            )
        ]

    async def _search_flipkart(self, keyword: str) -> List[ProductResult]:
        # Mocking Flipkart search
        base_price = 1000.0 if "laptop" in keyword.lower() else 50.0
        return [
             ProductResult(
                title=f"Flipkart SmartBuy {keyword}",
                price=base_price * 0.95, # Cheaper
                currency="INR",
                store="Flipkart",
                url=f"https://flipkart.com/search?q={keyword}",
                rating=4.0
            )
        ]

    async def _search_shopify_aggregator(self, keyword: str) -> List[ProductResult]:
        # Mocking generic Shopify store search
        return [
             ProductResult(
                title=f"Premium {keyword} (Indie Store)",
                price=base_price * 1.5 if "laptop" in keyword.lower() else 80.0,
                currency="INR",
                store="Shopify (Various)",
                url=f"https://myshopify.com/search?q={keyword}",
                rating=4.8
            )
        ]

commerce_service = CommerceService()
