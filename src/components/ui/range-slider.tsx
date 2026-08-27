import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { useTheme } from '@/theme';

type RangeSliderProps = {
  min: number;
  max: number;
  /** Smallest distance a drag can move a thumb, in the same units as min/max. */
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (valueMin: number, valueMax: number) => void;
};

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

/**
 * A two-thumb min/max range slider — PDF Filters artboard's Price Range
 * control. React Native's core `Slider` is single-thumb only, and this is a
 * simple enough drag interaction to build directly on `PanResponder` rather
 * than pull in a third-party range-slider dependency.
 *
 * `PanResponder` is an imperative RN API: its handlers fire from the native
 * gesture system, never during React's render phase, so the mutable
 * "gesture start position" a drag needs is a textbook `useRef` use case —
 * the React Compiler lint's ref/immutability rules are overcautious about
 * this pattern (they're tuned for render-phase mutation, which this isn't),
 * hence the disables below rather than restructuring around them.
 */
export function RangeSlider({ min, max, step = 1, valueMin, valueMax, onChange }: RangeSliderProps) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const startXRef = useRef(0);

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
  const roundToStep = (v: number) => Math.round(v / step) * step;

  const valueToX = (value: number) =>
    trackWidth === 0 ? 0 : ((value - min) / (max - min)) * trackWidth;

  const xToValue = (x: number) =>
    trackWidth === 0 ? min : roundToStep(min + (clamp(x, 0, trackWidth) / trackWidth) * (max - min));

  /* eslint-disable react-hooks/refs, react-hooks/exhaustive-deps */
  const minResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startXRef.current = valueToX(valueMin);
        },
        onPanResponderMove: (_evt, gesture) => {
          const value = xToValue(startXRef.current + gesture.dx);
          onChange(clamp(value, min, valueMax), valueMax);
        },
      }),
    [valueMin, valueMax, trackWidth]
  );

  const maxResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startXRef.current = valueToX(valueMax);
        },
        onPanResponderMove: (_evt, gesture) => {
          const value = xToValue(startXRef.current + gesture.dx);
          onChange(valueMin, clamp(value, valueMin, max));
        },
      }),
    [valueMin, valueMax, trackWidth]
  );
  /* eslint-enable react-hooks/refs, react-hooks/exhaustive-deps */

  function onTrackLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width - THUMB_SIZE);
  }

  const minX = valueToX(valueMin);
  const maxX = valueToX(valueMax);

  return (
    <View style={{ height: THUMB_SIZE, justifyContent: 'center' }} onLayout={onTrackLayout}>
      <View
        style={[
          styles.track,
          { backgroundColor: colors.track, top: (THUMB_SIZE - TRACK_HEIGHT) / 2 },
        ]}
      />
      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.sliderFill,
            top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
            left: minX + THUMB_SIZE / 2,
            width: Math.max(0, maxX - minX),
          },
        ]}
      />
      <View
        {...minResponder.panHandlers}
        style={[styles.thumb, { backgroundColor: colors.sliderFill, left: minX }]}
      />
      <View
        {...maxResponder.panHandlers}
        style={[styles.thumb, { backgroundColor: colors.sliderFill, left: maxX }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
});
