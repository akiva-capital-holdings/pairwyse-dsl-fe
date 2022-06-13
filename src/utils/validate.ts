export default function getRule(label: string) {
    const defaultRule = {
      required: true,
      message: `Field ${label.toLowerCase()} cannot be empty `,
    };
    return [defaultRule]
  }