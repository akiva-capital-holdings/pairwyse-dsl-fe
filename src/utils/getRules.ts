/* eslint-disable arrow-body-style */
export default function getRule(label: string) {
    const defaultRule = {
        required: true,
        message: `Please enter ${label.toLowerCase()}`,
    }
    return defaultRule
}
