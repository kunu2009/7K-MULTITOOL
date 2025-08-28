
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, ArrowLeftRight, ChevronLeft, ChevronRight, Save } from 'lucide-react';

type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export default function FlashcardMakerPage() {
  const [cards, setCards] = React.useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedCards = localStorage.getItem('flashcards');
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error("Failed to load flashcards from localStorage", error);
    }
  }, []);

  const saveCards = (newCards: Flashcard[]) => {
    setCards(newCards);
    localStorage.setItem('flashcards', JSON.stringify(newCards));
  };
  
  const addCard = () => {
    const newCards = [...cards, { id: Date.now().toString(), front: 'Front', back: 'Back' }];
    saveCards(newCards);
    setCurrentCardIndex(newCards.length - 1);
  };
  
  const deleteCard = () => {
    if (cards.length === 0) return;
    const newCards = cards.filter((_, index) => index !== currentCardIndex);
    saveCards(newCards);
    setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
  };

  const updateCard = (field: 'front' | 'back', value: string) => {
    if (cards.length === 0) return;
    const newCards = cards.map((card, index) => 
        index === currentCardIndex ? { ...card, [field]: value } : card
    );
    saveCards(newCards);
  };
  
  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Flashcard Viewer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div 
            className="w-full h-64 border-2 rounded-lg flex items-center justify-center p-4 text-2xl text-center cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {cards.length > 0 ? (isFlipped ? currentCard.back : currentCard.front) : 'Add a card to get started!'}
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={prevCard} disabled={cards.length < 2}><ChevronLeft /></Button>
            <span>{cards.length > 0 ? `${currentCardIndex + 1} / ${cards.length}` : '0 / 0'}</span>
            <Button onClick={nextCard} disabled={cards.length < 2}><ChevronRight /></Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentCard ? (
            <>
              <div className="space-y-2">
                <Label>Front</Label>
                <Textarea value={currentCard.front} onChange={(e) => updateCard('front', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Back</Label>
                <Textarea value={currentCard.back} onChange={(e) => updateCard('back', e.target.value)} />
              </div>
            </>
          ) : <p className="text-sm text-muted-foreground">No card selected.</p>}
           <div className="flex gap-2">
            <Button onClick={addCard}><Plus /></Button>
            <Button onClick={deleteCard} variant="destructive" disabled={cards.length === 0}><Trash2 /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
