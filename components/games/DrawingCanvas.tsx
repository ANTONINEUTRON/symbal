// components/games/DrawingCanvas.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PanResponder, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Palette, RotateCcw, Check, Eraser } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH - 40;

interface DrawingCanvasProps {
  prompt: string;
  colorPalette: string[];
  timeLimit: number;
  onComplete: (drawingData: string) => void;
}

interface PathData {
  path: string;
  color: string;
  strokeWidth: number;
  isEraser?: boolean;
}

export default function DrawingCanvas({ prompt, colorPalette, timeLimit, onComplete }: DrawingCanvasProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentDrawingPath, setCurrentDrawingPath] = useState<PathData | null>(null); // New state for current path object
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isEraserMode, setIsEraserMode] = useState(false);

  // Enhanced color palette with black and white
  const enhancedPalette = ['#000000', '#FFFFFF', ...colorPalette];

  // Timer effect
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const newPath = `M${locationX},${locationY}`;

      setCurrentDrawingPath({
        path: newPath,
        color: isEraserMode ? '#FFFFFF' : selectedColor,
        strokeWidth: isEraserMode ? strokeWidth * 2 : strokeWidth,
        isEraser: isEraserMode
      });
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;

      setCurrentDrawingPath(prev => {
        if (!prev) return null; // Should not happen if grant was called
        const newPath = `${prev.path} L${locationX},${locationY}`;
        return { ...prev, path: newPath };
      });
    },

    onPanResponderRelease: () => {
      if (currentDrawingPath) {
        setPaths(prev => [...prev, currentDrawingPath]);
        setCurrentDrawingPath(null); // Clear current drawing path after adding to completed paths
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentDrawingPath(null);
  };

  const toggleEraser = () => {
    setIsEraserMode(!isEraserMode);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setIsEraserMode(false); // Exit eraser mode when selecting a color
  };

  const handleComplete = () => {
    // Convert drawing to SVG string
    const allPaths = currentDrawingPath ? [...paths, currentDrawingPath] : paths;

    const svgPaths = allPaths.map((pathData) => {
      // Ensure pathData is not null/undefined here, though the state management should prevent it
      if (!pathData) return '';

      if (pathData.isEraser) {
        return `<path d="${pathData.path}" stroke="white" stroke-width="${pathData.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
      }
      return `<path d="${pathData.path}" stroke="${pathData.color}" stroke-width="${pathData.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;
    }).join('\n');

    const svgString = `
      <svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        ${svgPaths}
      </svg>
    `;

    onComplete(svgString.trim());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasDrawing = paths.length > 0 || currentDrawingPath !== null;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.prompt}>{prompt}</Text>
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        </View>

        {/* Canvas */}
        <View style={styles.canvasContainer}>
          <View
            style={[styles.canvas, { width: CANVAS_SIZE, height: CANVAS_SIZE }]}
            {...panResponder.panHandlers}
          >
            <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={styles.svg}>
              {/* White background */}
              <Path
                d={`M0,0 L${CANVAS_SIZE},0 L${CANVAS_SIZE},${CANVAS_SIZE} L0,${CANVAS_SIZE} Z`}
                fill="white"
                stroke="none"
              />

              {/* Completed paths */}
              {paths.map((pathData, index) => (
                <Path
                  key={index}
                  d={pathData.path}
                  stroke={pathData.isEraser ? 'white' : pathData.color}
                  strokeWidth={pathData.strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* Current path being drawn */}
              {currentDrawingPath && (
                <Path
                  d={currentDrawingPath.path}
                  stroke={currentDrawingPath.isEraser ? 'white' : currentDrawingPath.color}
                  strokeWidth={currentDrawingPath.strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
          </View>
        </View>

        {/* Color Palette */}
        <View style={styles.colorPalette}>
          <Text style={styles.paletteLabel}>Colors</Text>
          <View style={styles.colorRow}>
            {enhancedPalette.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  color === '#FFFFFF' && styles.whiteColorBorder,
                  selectedColor === color && !isEraserMode && styles.selectedColor
                ]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </View>
        </View>

        {/* Tools Section */}
        <View style={styles.toolsSection}>
          <View style={styles.toolGroup}>
            <Text style={styles.toolLabel}>Tools</Text>
            <TouchableOpacity
              style={[
                styles.toolButton,
                isEraserMode && styles.selectedTool
              ]}
              onPress={toggleEraser}
            >
              <Eraser size={20} color={isEraserMode ? '#8B5CF6' : '#9CA3AF'} />
              <Text style={[
                styles.toolButtonText,
                isEraserMode && styles.selectedToolText
              ]}>
                Eraser
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolGroup}>
            <Text style={styles.toolLabel}>Brush Size</Text>
            <View style={styles.brushSizes}>
              {[2, 4, 6, 8].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.brushButton,
                    strokeWidth === size && styles.selectedBrush
                  ]}
                  onPress={() => setStrokeWidth(size)}
                >
                  <View
                    style={[
                      styles.brushPreview,
                      {
                        width: size * 2,
                        height: size * 2,
                        backgroundColor: isEraserMode ? '#9CA3AF' : selectedColor
                      }
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <RotateCcw size={20} color="#EF4444" />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.completeButton,
              !hasDrawing && styles.completeButtonDisabled
            ]}
            onPress={handleComplete}
            disabled={!hasDrawing}
          >
            <LinearGradient
              colors={hasDrawing ? ['#10B981', '#059669'] : ['#6B7280', '#4B5563']}
              style={styles.completeButtonGradient}
            >
              <Check size={20} color="white" />
              <Text style={styles.completeButtonText}>Complete Drawing</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  prompt: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    flex: 1,
    marginRight: 16,
  },
  timer: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  canvas: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  svg: {
    borderRadius: 12,
  },
  colorPalette: {
    marginBottom: 20,
  },
  paletteLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  whiteColorBorder: {
    borderColor: '#E5E7EB',
  },
  selectedColor: {
    borderColor: '#8B5CF6',
    borderWidth: 4,
  },
  toolsSection: {
    marginBottom: 20,
  },
  toolGroup: {
    marginBottom: 16,
  },
  toolLabel: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 8,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTool: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  toolButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  selectedToolText: {
    color: '#8B5CF6',
  },
  brushSizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  brushButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBrush: {
    borderColor: '#8B5CF6',
  },
  brushPreview: {
    borderRadius: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  completeButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonDisabled: {
    opacity: 0.5,
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
});