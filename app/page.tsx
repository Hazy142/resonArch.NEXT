import { HomeExperience } from "@/components/home-experience";
import { catalog } from "@/lib/catalog";

export default function HomePage() {
  return <HomeExperience initialCatalog={catalog} />;
}
