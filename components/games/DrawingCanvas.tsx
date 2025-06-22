import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { Palette, RotateCcw, Check } from 'lucide-react-native';

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
}

export default function DrawingCanvas({ prompt, colorPalette, timeLimit, onComplete }: DrawingCanvasProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60); // Convert to seconds
  const [isDrawing, setIsDrawing] = useState(false);

  const pathRef = useRef('');

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
      pathRef.current = newPath;
      setCurrentPath(newPath);
      setIsDrawing(true);
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const newPath = `${pathRef.current} L${locationX},${locationY}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
    },

    onPanResponderRelease: () => {
      if (pathRef.current) {
        setPaths(prev => [...prev, {
          path: pathRef.current,
          color: selectedColor,
          strokeWidth: strokeWidth
        }]);
        setCurrentPath('');
        pathRef.current = '';
      }
      setIsDrawing(false);
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
  };

  const handleComplete = () => {
    // Convert drawing to SVG string
    const svgPaths = paths.map((pathData, index) => 
      `<path d="${pathData.path}" stroke="${pathData.color}" stroke-width="${pathData.strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`
    ).join('\n');

    const svgString = `
      <svg width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
        ${svgPaths}
        ${currentPath ? `<path d="${currentPath}" stroke="${selectedColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round" />` : ''}
      </svg>
    `;

    onComplete(svgString.trim());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
            {paths.map((pathData, index) => (
              <Path
                key={index}
                d={pathData.path}
                stroke={pathData.color}
                strokeWidth={pathData.strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath && (
              <Path
                d={currentPath}
                stroke={selectedColor}
                strokeWidth={strokeWidth}
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
          {colorPalette.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                selectedColor === color && styles.selectedColor
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {/* Brush Size */}
      <View style={styles.brushSection}>
        <Text style={styles.brushLabel}>Brush Size</Text>
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
                    backgroundColor: selectedColor
                  }
                ]}
              />
            </TouchableOpacity>
          ))}
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
            paths.length === 0 && styles.completeButtonDisabled
          ]}
          onPress={handleComplete}
          disabled={paths.length === 0}
        >
          <LinearGradient
            colors={paths.length > 0 ? ['#10B981', '#059669'] : ['#6B7280', '#4B5563']}
            style={styles.completeButtonGradient}
          >
            <Check size={20} color="white" />
            <Text style={styles.completeButtonText}>Complete Drawing</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  selectedColor: {
    borderColor: 'white',
  },
  brushSection: {
    marginBottom: 20,
  },
  brushLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
});