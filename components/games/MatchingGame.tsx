import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import { gameContent } from '@/data/storyData';

interface MatchingGameProps {
  onComplete: () => void;
}

export default function MatchingGame({ onComplete }: MatchingGameProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [correctMatches, setCorrectMatches] = useState<string[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);

  const pairs = gameContent.matching;

  useEffect(() => {
    // Shuffle definitions for display
    const definitions = pairs.map(pair => pair.definition);
    setShuffledDefinitions(definitions.sort(() => Math.random() - 0.5));
  }, []);

  const handleTermPress = (term: string) => {
    if (correctMatches.includes(term)) return;
    
    setSelectedTerm(selectedTerm === term ? null : term);
    setSelectedDefinition(null);
  };

  const handleDefinitionPress = (definition: string) => {
    if (Object.values(matches).includes(definition)) return;
    
    setSelectedDefinition(selectedDefinition === definition ? null : definition);
    
    if (selectedTerm) {
      // Check if this is a correct match
      const correctPair = pairs.find(pair => pair.term === selectedTerm);
      if (correctPair && correctPair.definition === definition) {
        setMatches({ ...matches, [selectedTerm]: definition });
        setCorrectMatches([...correctMatches, selectedTerm]);
        setSelectedTerm(null);
        setSelectedDefinition(null);
        
        // Check if all matches are complete
        if (correctMatches.length + 1 === pairs.length) {
          setTimeout(() => onComplete(), 1000);
        }
      } else {
        // Wrong match - reset after a brief moment
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedDefinition(null);
        }, 500);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Match Terms to Definitions</Text>
        <Text style={styles.progress}>
          {correctMatches.length} / {pairs.length} matched
        </Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Terms</Text>
          {pairs.map((pair) => (
            <TouchableOpacity
              key={pair.term}
              style={[
                styles.item,
                selectedTerm === pair.term && styles.selectedItem,
                correctMatches.includes(pair.term) && styles.matchedItem
              ]}
              onPress={() => handleTermPress(pair.term)}
            >
              <LinearGradient
                colors={
                  correctMatches.includes(pair.term)
                    ? ['#10B981', '#059669']
                    : selectedTerm === pair.term
                    ? ['#8B5CF6', '#EC4899']
                    : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.15)']
                }
                style={styles.itemGradient}
              >
                <Text style={styles.itemText}>{pair.term}</Text>
                {correctMatches.includes(pair.term) && (
                  <CheckCircle size={16} color="white" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>Definitions</Text>
          {shuffledDefinitions.map((definition) => {
            const isMatched = Object.values(matches).includes(definition);
            return (
              <TouchableOpacity
                key={definition}
                style={[
                  styles.item,
                  selectedDefinition === definition && styles.selectedItem,
                  isMatched && styles.matchedItem
                ]}
                onPress={() => handleDefinitionPress(definition)}
              >
                <LinearGradient
                  colors={
                    isMatched
                      ? ['#10B981', '#059669']
                      : selectedDefinition === definition
                      ? ['#8B5CF6', '#EC4899']
                      : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.15)']
                  }
                  style={styles.itemGradient}
                >
                  <Text style={styles.itemText}>{definition}</Text>
                  {isMatched && (
                    <CheckCircle size={16} color="white" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {selectedTerm && (
        <Text style={styles.instruction}>
          Now select the definition for "{selectedTerm}"
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progress: {
    color: '#8B5CF6',
    fontSize: 14,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  item: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedItem: {
    transform: [{ scale: 1.02 }],
  },
  matchedItem: {
    opacity: 0.8,
  },
  itemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  instruction: {
    color: '#F59E0B',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});