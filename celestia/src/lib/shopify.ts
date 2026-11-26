import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2026-10";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "celestia-cosmic-boutique-6s3t7-9w8cegze.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "b30368e967a844830b60ae37a0026c69";

export interface Money { amount: string; currencyCode: string }
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    createdAt: string;
    priceRange: { minVariantPrice: Money };
    compareAtPriceRange: { minVariantPrice: Money };
    images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: Money;
          compareAtPrice: Money | null;
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const PRODUCT_FIELDS = `
  id title description handle productType tags createdAt
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  images(first: 5) { edges { node { url altText } } }
  variants(first: 10) { edges { node { id title price { amount currencyCode } compareAtPrice { amount currencyCode } availableForSale selectedOptions { name value } } } }
  options { name values }
`;

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) { edges { node { ${PRODUCT_FIELDS} } } }
  }
`;
export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}): Promise<any> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (data.errors) throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  return data;
}

export const productsQueryOptions = () => ({
  queryKey: ["products"],
  queryFn: async (): Promise<ShopifyProduct[]> => {
    const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
    return data?.data?.products?.edges ?? [];
  },
});

export const productQueryOptions = (handle: string) => ({
  queryKey: ["product", handle],
  queryFn: async (): Promise<ShopifyProduct | null> => {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    const node = data?.data?.product;
    return node ? { node } : null;
  },
});

export function formatPrice(m: Money) {
  return new Intl.NumberFormat("en", { style: "currency", currency: m.currencyCode }).format(parseFloat(m.amount));
}

export const CATEGORIES = [
  { slug: "Planets", label: "Planets", emoji: "🪐", image: "/categories/planets.jpg" },
  { slug: "Galaxies", label: "Galaxies & Nebulae", emoji: "🌌", image: "/categories/galaxies.jpg" },
  { slug: "Stars", label: "Stars", emoji: "✨", image: "/categories/stars.jpg" },
  { slug: "Moons", label: "Moons", emoji: "🌙", image: "/categories/moons.jpg" },
  { slug: "Cosmic Accessories", label: "Cosmic Accessories", emoji: "💫", image: "/categories/accessories.jpg" },
] as const;
