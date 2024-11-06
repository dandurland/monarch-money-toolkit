const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

export function formatCurrency(value: number) : string {
    return formatter.format(value);
}