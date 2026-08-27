import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { signInWithApple, signInWithWebProvider, type WebOAuthProvider } from '@/lib/social-auth';
import { useTheme } from '@/theme';

// Cropped directly from the PDF's Sign Up artboard at high resolution, with
// only the artboard background made transparent. Keeping the source pixels
// preserves the exact multicolour Google mark and the PDF's logo proportions.
const ICONS = {
  apple:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABUCAMAAAD9EDqWAAACClBMVEXx6ufk3tvr5OHp4t/t5uPq4+Dw6ebu5+Ti3Nnl3tzv6OXm393j3drn4N3o4d7LxcKKhoVZV1Y6ODjW0M3d1tN/e3omJSUAAADEvrzg2tdraGcICAiUkI4RERHSzMpMSkkCAgLY0s8rKiknJibc1dMiISFhXl00MzKrpqNgXVwXFhappKJ4dXMfHh0QDw+EgH6MiIYWFhWempgSEhLTzcpNS0oGBga1sK0ODQ0DAwOgnJrFv72inZudmZcVFRSGgoBEQkLa09F+enmjnpyIhIIdHBxdWlmzrqyRjYtqZ2ZpZmV8eXfOyMXh29jCvbrJw8DMxsOYk5Ftamk4NzYyMDBOTEuQjIq9t7XQysh5dnQwLi4BAQFbWVevqqgZGBgJCQlGREOWkZCyratDQUAREBC2sa5oZWQMCwtmY2HUzsvOyMYcGxtua2nBvLlyb20gHx5zb24TExNLSUgYFxcKCgmoo6Hf2dYzMjEuLCwFBQXX0c63sq+Pi4koJya/ureJhYQbGhoUFBONiYewq6ksKypvbGoeHRx3c3KSjoxnZGMqKShVUlFJR0Y2NTRlYmAxLy9YVlU1NDNBPz5RTk1nZGKBfXxUUVChnJrGwL5cWVjIwsCCfn1KSEdQTk20r60vLS3Dvbs/PTyloJ43NjW7tbNST04LCwq4srA7OTl2cnENDAyfm5nZ09AEBAQulCMoAAAAD3RSTlMAAAAAAAAAAAAAAAAAAAAnp8O0AAACv0lEQVRYw63YZ1cTQRQG4JEEMICFGL2EgIZgo4kk0gQBAUFBFAWNEhEkKKiACIgiKFYU7Nh77/ofTSC7eyfleNg376eclOfMZObenV0hdGTZ8mTzCj0/DI5l5SryJQWXrKk2ouhYaekUyGpQWrRGkcgeg1EZDpWiTIxau06jaD1EGTYwijZCVhanso0IlcMpykWo2DxObbIiVr40rM0IFVPAKXMcYjk55dqCUKKQUUXFEBVfolGlWyFKlLFRlWOU2KZSFdgEfalUqKrtKCWq5yVHDSwJUeuDdtTVL/yHi4t35u5qaHTu1t5q2rO3SXndvG9/YUur+UDqQfd/+uGhw20etRkcyQn6dnx71lG20zo6j5kiSl1eD0npzjqu1Yv7RAEFp6f3ZFjplJfC5HSfO8H3Yf/AGQqbosHYECmu0kYRcrZqaJgiJzP4+pY4RLozck6iRs/rp3w16mRU0gWEIhrr0tbai1G+BVev44MoRZ0XA9S4HZRsE8qojJdAquCy+m9NgtQVrXKXXMUoF2sC1zDKfp3trRuYdZNRZRg1tZRZtzDrNq/EVohyGRhlwvbpNB/WODbFLm5NQNSY1FP7IGtGaoJ3IOuuZGGdq06y7kFWr2S1QdZ9yXoAWQ8l6xFkzUrWLGTlSdZjyPKMcusJZJF0en2KWc+49RyzbPzO6AVmUTWzYsYwK50PDNusRC+ZNQ1afClrUKukTLWs6MGEKpqjVJH+ZPcrViNsUYdyxnyFW0TJlnlsJhpY9+tEv5WPS/688VsWcOsHkjY3ybfRoEaS5qx30bCUWnofBetDwCrHqY/Kdo1zwFa7WkefUOoz6zwtoPWFWSmlEPVVuk42INQ3+abbNAVYtULOd/2z/JEQZImfeqlfoc+TjXrX8rcIzZ8KXVT4R8D1f3VQrYawlp7D/nCGiJCBhVI92u2x+AfVfLswA++o0QAAAABJRU5ErkJggg==',
  google:
    'data:image/png;base64,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',
  facebook:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAA9CAMAAAD28uvEAAABmFBMVEXx6ufv6OXu5+Tr5OLn4d/m4N7q5OHo4uDCxMqNp8RhmNNAkOEnjfEQhfcHgfoGgfsShfcqjfBDj91glc2CoMOos8PPztHY1NV1ncgdh/MCgPwAgPoBf/sBf/wAf/wAgPwAf/0BgPwCf/wCfvwCgPuwuMR+o8sMgvaut8Tc2Ng8kN0DfvoBgPvf2tkui+dFjtmGosXa1tUPg/hxm8kDfvsAgP0UhfUDfvijsMIBf/2ut8VclM4Cf/s/juBvmsp7nL+Fob+MpcKSqsSWrMWYrsbY1dUnie45jN7GxswHf/c8jNzNy84Lgfe9wclQlde1vMcAgPuWq8SzusbBw8qzusfb19cEgPoFgPsEgPuyu8cEf/qyu8kBfv0Ef/i9wcowj+4ukPAwkO8li/Itj/EvkPAvj/BhntyyusVdl9N6nsWZrcO4vcbX1NUMg/osjO1KktwEfvpsmMgCfvuLpMICfvqqtsTOzdBumsptmsttm8pSktgBfvwDgPhkl89mlslllslml8nW0tOrtcQDf/qrtcMAf/sDf/uossH4rS6jAAAACHRSTlMAAAAAAAAAALfnUqEAAAFVSURBVEjH7dNVUwMxEAfw0B4uRQu0l2uuOC3OAQeHu7u7u7s7fG2Yocxs6GW6DwzDQ/+v+c1uZEOIWUIiIqOiY2LjbPEJiUnJKXaLGUpNS3c4Zaq4GJNVdwZzZ2b5I2t2DvsROddP5eV7vIFZQaHMWEBmKfIwBCumDMFKSlGsrFxDMKmiEsOqqAab6kzTKKWKqlZzrIarochGbV19Q2NTc0srx9r4Vu0dpg8e2gl2Rr1dkqki3QZgSo/dXJFeA7SkfQJF+uFzDgyK2BC8DcewiI0ogKmjKDYmoZjN+ptsPAzFJsJFbBJe75TwCNMzgM3ybG5+wZfFJfjz6PLK98LqGiHrptPPZwPHNlFM38JV20YxbQfFdi0Ipul7BMX2UezgEMNcR8codnL6yc7OL3y5vLoG//Tm9u7+Kw+P/IQ8OUGRZ+EgvbwC9iZmSpAF2d+x93/GPgAzcc6Fj9rGRgAAAABJRU5ErkJggg==',
} as const;

type SocialProvider = 'apple' | WebOAuthProvider;

type Props = {
  disabled?: boolean;
  onStart?: () => boolean;
  onError: (error: unknown) => void;
};

export function SocialAuthButtons({ disabled = false, onStart, onError }: Props) {
  const { colors, spacing, typography } = useTheme();
  const [busyProvider, setBusyProvider] = useState<SocialProvider | null>(null);

  const launch = async (provider: SocialProvider) => {
    if (disabled || busyProvider) return;
    if (onStart?.() === false) return;
    setBusyProvider(provider);

    try {
      if (provider === 'apple') await signInWithApple();
      else await signInWithWebProvider(provider);
    } catch (error) {
      onError(error);
    } finally {
      setBusyProvider(null);
    }
  };

  return (
    <View style={{ gap: spacing.md }}>
      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: colors.text }]} />
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: typography.family.regular,
            fontSize: typography.size.sm,
          }}
        >
          Or sign in with
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.text }]} />
      </View>

      <View style={styles.buttons}>
        {(['apple', 'google', 'facebook'] as const).map((provider) => (
          <Pressable
            key={provider}
            accessibilityRole="button"
            accessibilityLabel={`Continue with ${provider[0].toUpperCase()}${provider.slice(1)}`}
            accessibilityState={{
              disabled: disabled || Boolean(busyProvider),
              busy: busyProvider === provider,
            }}
            disabled={disabled || Boolean(busyProvider)}
            onPress={() => void launch(provider)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.socialButton,
              {
                opacity:
                  disabled || (busyProvider && busyProvider !== provider)
                    ? 0.4
                    : pressed
                      ? 0.65
                      : 1,
              },
            ]}
          >
            <Image source={{ uri: ICONS[provider] }} resizeMode="contain" style={styles.icon} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  divider: { flex: 1, height: StyleSheet.hairlineWidth * 2 },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 28 },
  socialButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 40, height: 40 },
});
