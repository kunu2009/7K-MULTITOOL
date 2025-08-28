
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function ResultDisplay({ label, value, isHighlight = false }: { label: string; value: string; isHighlight?: boolean }) {
    return (
        <div className={`flex justify-between items-center p-3 rounded-lg ${isHighlight ? 'bg-primary/10' : 'bg-secondary'}`}>
            <p className="font-medium text-muted-foreground">{label}</p>
            <p className={`font-mono text-xl font-semibold ${isHighlight ? 'text-primary' : ''}`}>${value}</p>
        </div>
    );
}

export default function DiscountCalculatorPage() {
    const [price, setPrice] = React.useState('100');
    const [discount, setDiscount] = React.useState('15');
    const [tax, setTax] = React.useState('8');

    const originalPrice = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;
    const taxPercent = parseFloat(tax) || 0;
    
    const savedAmount = (originalPrice * discountPercent) / 100;
    const priceAfterDiscount = originalPrice - savedAmount;
    const taxAmount = (priceAfterDiscount * taxPercent) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Discount & GST/Tax Calculator</CardTitle>
                <CardDescription>Quickly calculate final prices after discounts and taxes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Original Price ($)</Label>
                        <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input id="discount" type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="tax">Tax/GST (%)</Label>
                        <Input id="tax" type="number" value={tax} onChange={e => setTax(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <ResultDisplay label="You Save" value={savedAmount.toFixed(2)} />
                    <ResultDisplay label="Price After Discount" value={priceAfterDiscount.toFixed(2)} />
                    <ResultDisplay label="Tax Amount" value={taxAmount.toFixed(2)} />
                    <ResultDisplay label="Final Price" value={finalPrice.toFixed(2)} isHighlight />
                </div>
            </CardContent>
        </Card>
    );
}
