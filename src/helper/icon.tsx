  
  import { Users, Package, ShoppingCart } from "lucide-react"

  /**
   * Returns a React icon component based on the provided iconName.
   * Defaults to the Package icon if iconName is unrecognized.
   *
   * @param iconName - The name of the icon to render ("users", "package", "shopping-cart").
   * @returns The corresponding React icon component.
   */
  export function getIcon(iconName: string): JSX.Element {
    const icons: Record<string, JSX.Element> = {
      users: <Users className="h-12 w-12" />,
      package: <Package className="h-12 w-12" />,
      "shopping-cart": <ShoppingCart className="h-12 w-12" />,
    };

    return icons[iconName] ?? <Package className="h-12 w-12" />;
  }