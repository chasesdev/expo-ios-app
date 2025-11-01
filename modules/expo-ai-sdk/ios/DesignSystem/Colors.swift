import SwiftUI

/// Design System Colors for AI SDK UI
/// Matches the web app's design tokens from Tailwind configuration
extension Color {
    // MARK: - Semantic Colors (Light Mode)

    struct Light {
        static let background = Color(hex: "FFFFFF")
        static let foreground = Color(hex: "252525")

        static let card = Color(hex: "FFFFFF")
        static let cardForeground = Color(hex: "252525")

        static let popover = Color(hex: "FFFFFF")
        static let popoverForeground = Color(hex: "252525")

        static let primary = Color(hex: "343434")
        static let primaryForeground = Color(hex: "FCFCFC")

        static let secondary = Color(hex: "F7F7F7")
        static let secondaryForeground = Color(hex: "343434")

        static let muted = Color(hex: "F7F7F7")
        static let mutedForeground = Color(hex: "8E8E8E")

        static let accent = Color(hex: "F7F7F7")
        static let accentForeground = Color(hex: "343434")

        static let destructive = Color(hex: "DC2626")
        static let destructiveForeground = Color(hex: "FCFCFC")

        static let border = Color(hex: "EBEBEB")
        static let input = Color(hex: "EBEBEB")
        static let ring = Color(hex: "B5B5B5")

        // Chart colors
        static let chart1 = Color(hex: "F59E0B")
        static let chart2 = Color(hex: "14B8A6")
        static let chart3 = Color(hex: "3B82F6")
        static let chart4 = Color(hex: "84CC16")
        static let chart5 = Color(hex: "EAB308")
    }

    // MARK: - Semantic Colors (Dark Mode)

    struct Dark {
        static let background = Color(hex: "252525")
        static let foreground = Color(hex: "FCFCFC")

        static let card = Color(hex: "343434")
        static let cardForeground = Color(hex: "FCFCFC")

        static let popover = Color(hex: "343434")
        static let popoverForeground = Color(hex: "FCFCFC")

        static let primary = Color(hex: "EBEBEB")
        static let primaryForeground = Color(hex: "343434")

        static let secondary = Color(hex: "454545")
        static let secondaryForeground = Color(hex: "FCFCFC")

        static let muted = Color(hex: "454545")
        static let mutedForeground = Color(hex: "B5B5B5")

        static let accent = Color(hex: "454545")
        static let accentForeground = Color(hex: "FCFCFC")

        static let destructive = Color(hex: "EF4444")
        static let destructiveForeground = Color(hex: "FCFCFC")

        static let border = Color.white.opacity(0.1)
        static let input = Color.white.opacity(0.15)
        static let ring = Color(hex: "8E8E8E")

        // Chart colors
        static let chart1 = Color(hex: "8B5CF6")
        static let chart2 = Color(hex: "10B981")
        static let chart3 = Color(hex: "EAB308")
        static let chart4 = Color(hex: "EC4899")
        static let chart5 = Color(hex: "F97316")
    }

    // MARK: - Adaptive Colors (Auto Light/Dark)

    /// Returns the appropriate color based on the current color scheme
    static func adaptive(
        light: Color,
        dark: Color,
        colorScheme: ColorScheme
    ) -> Color {
        colorScheme == .dark ? dark : light
    }

    // Semantic color accessors that adapt to color scheme
    static func background(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.background, dark: Dark.background, colorScheme: colorScheme)
    }

    static func foreground(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.foreground, dark: Dark.foreground, colorScheme: colorScheme)
    }

    static func card(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.card, dark: Dark.card, colorScheme: colorScheme)
    }

    static func cardForeground(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.cardForeground, dark: Dark.cardForeground, colorScheme: colorScheme)
    }

    static func primary(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.primary, dark: Dark.primary, colorScheme: colorScheme)
    }

    static func primaryForeground(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.primaryForeground, dark: Dark.primaryForeground, colorScheme: colorScheme)
    }

    static func secondary(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.secondary, dark: Dark.secondary, colorScheme: colorScheme)
    }

    static func secondaryForeground(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.secondaryForeground, dark: Dark.secondaryForeground, colorScheme: colorScheme)
    }

    static func muted(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.muted, dark: Dark.muted, colorScheme: colorScheme)
    }

    static func mutedForeground(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.mutedForeground, dark: Dark.mutedForeground, colorScheme: colorScheme)
    }

    static func accent(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.accent, dark: Dark.accent, colorScheme: colorScheme)
    }

    static func accentForeground(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.accentForeground, dark: Dark.accentForeground, colorScheme: colorScheme)
    }

    static func destructive(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.destructive, dark: Dark.destructive, colorScheme: colorScheme)
    }

    static func border(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.border, dark: Dark.border, colorScheme: colorScheme)
    }

    static func input(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.input, dark: Dark.input, colorScheme: colorScheme)
    }

    static func ring(_ colorScheme: ColorScheme) -> Color {
        adaptive(light: Light.ring, dark: Dark.ring, colorScheme: colorScheme)
    }

    // MARK: - Hex Color Initializer

    /// Initialize a Color from a hex string
    /// - Parameter hex: Hex string (e.g., "FFFFFF" or "#FFFFFF")
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)

        let r, g, b, a: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (r, g, b, a) = ((int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17, 255)
        case 6: // RGB (24-bit)
            (r, g, b, a) = (int >> 16, int >> 8 & 0xFF, int & 0xFF, 255)
        case 8: // ARGB (32-bit)
            (r, g, b, a) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (r, g, b, a) = (0, 0, 0, 255)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Design System Constants

struct DesignSystem {
    /// Border radius values
    struct Radius {
        static let base: CGFloat = 10  // 0.625rem = 10px
        static let sm: CGFloat = 6     // base - 4px
        static let md: CGFloat = 8     // base - 2px
        static let lg: CGFloat = 10    // base
        static let xl: CGFloat = 14    // base + 4px
    }

    /// Spacing values
    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }

    /// Shadow values
    struct Shadow {
        static let sm = (color: Color.black.opacity(0.05), radius: CGFloat(2), x: CGFloat(0), y: CGFloat(1))
        static let md = (color: Color.black.opacity(0.1), radius: CGFloat(4), x: CGFloat(0), y: CGFloat(2))
        static let lg = (color: Color.black.opacity(0.1), radius: CGFloat(8), x: CGFloat(0), y: CGFloat(4))
        static let xl = (color: Color.black.opacity(0.15), radius: CGFloat(16), x: CGFloat(0), y: CGFloat(8))
    }
}
