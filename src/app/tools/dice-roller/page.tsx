
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dices, Coins } from 'lucide-react';

export default function DiceRollerPage() {
    const [diceResult, setDiceResult] = React.useState(1);
    const [coinResult, setCoinResult] = React.useState('Heads');

    const rollDice = () => {
        setDiceResult(Math.floor(Math.random() * 6) + 1);
    };

    const flipCoin = () => {
        setCoinResult(Math.random() < 0.5 ? 'Heads' : 'Tails');
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dice Roller</CardTitle>
                    <CardDescription>Roll a standard six-sided die.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p className="text-7xl font-bold">{diceResult}</p>
                    <Button onClick={rollDice}><Dices className="mr-2"/>Roll Dice</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Coin Flip</CardTitle>
                    <CardDescription>Flip a virtual coin.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p className="text-5xl font-bold">{coinResult}</p>
                    <Button onClick={flipCoin}><Coins className="mr-2"/>Flip Coin</Button>
                </CardContent>
            </Card>
        </div>
    );
}
