export function cn(...inputs: any[]): string {
  return inputs
    .flat()
    .map(input => {
      if (typeof input === "string") return input;
      if (typeof input === "object" && input !== null) {
        return Object.entries(input)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}