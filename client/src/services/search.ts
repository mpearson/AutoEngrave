import { Iterable } from "immutable";
import { Design } from "../redux/catalog/types";

export const quickSearchDesigns = (designs: Iterable.Indexed<Design>, query: string) => {
  const keywords = query.toLowerCase().split(" ");
  return designs.filter(design => {
    const name = design.name.toLowerCase();
    for (const keyword of keywords) {
      if (name.indexOf(keyword) !== -1)
        return true;
    }
    return false;
  });
};
