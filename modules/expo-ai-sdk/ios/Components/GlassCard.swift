import SwiftUI

/// Frosted glass card component with configurable material intensity
///
/// Example usage:
/// ```swift
/// GlassCard(variant: .regular) {
///     VStack(alignment: .leading, spacing: 12) {
///         Text("Card Title").h3()
///         Text("Description").bodyText()
///     }
/// }
/// ```
struct GlassCard<Content: View>: View {
    @Environment(\.colorScheme) var colorScheme

    let content: () -> Content
    var variant: MaterialVariant = .regular
    var cornerRadius: CGFloat = DesignSystem.Radius.lg
    var padding: CGFloat = DesignSystem.Spacing.md
    var onTap: (() -> Void)? = nil

    enum MaterialVariant {
        case ultraThin, thin, regular, thick

        var material: Material {
            switch self {
            case .ultraThin: return .ultraThinMaterial
            case .thin: return .thinMaterial
            case .regular: return .regularMaterial
            case .thick: return .thickMaterial
            }
        }

        var borderOpacity: Double {
            switch self {
            case .ultraThin: return 0.3
            case .thin: return 0.4
            case .regular: return 0.5
            case .thick: return 0.6
            }
        }
    }

    var body: some View {
        Group {
            if let onTap = onTap {
                Button(action: onTap) {
                    cardContent
                }
                .buttonStyle(.plain)
            } else {
                cardContent
            }
        }
    }

    private var cardContent: some View {
        VStack(alignment: .leading, spacing: DesignSystem.Spacing.sm) {
            content()
        }
        .padding(padding)
        .background(variant.material, in: RoundedRectangle(cornerRadius: cornerRadius))
        .overlay(
            RoundedRectangle(cornerRadius: cornerRadius)
                .stroke(Color.border(colorScheme).opacity(variant.borderOpacity), lineWidth: 1)
        )
        .shadow(
            color: DesignSystem.Shadow.md.color,
            radius: DesignSystem.Shadow.md.radius,
            x: DesignSystem.Shadow.md.x,
            y: DesignSystem.Shadow.md.y
        )
        .compositingGroup()
    }
}

// MARK: - Previews

#Preview("Glass Cards - Light") {
    ZStack {
        // Background image for glass effect demo
        LinearGradient(
            colors: [.blue, .purple, .pink],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        ScrollView {
            LazyVStack(spacing: 20) {
                Text("Glass Card Variants")
                    .h1()
                    .foregroundColor(.white)
                    .padding(.top)

                // Ultra Thin
                GlassCard(variant: .ultraThin) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Ultra Thin Material")
                            .h4()
                        Text("Most transparent, minimal blur")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }

                // Thin
                GlassCard(variant: .thin) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Thin Material")
                            .h4()
                        Text("Light blur, subtle depth")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }

                // Regular
                GlassCard(variant: .regular) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Regular Material")
                            .h4()
                        Text("Standard blur, balanced")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }

                // Thick
                GlassCard(variant: .thick) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Thick Material")
                            .h4()
                        Text("Heavy blur, strong separation")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }

                // With tap action
                GlassCard(variant: .regular, onTap: {
                    print("Card tapped!")
                }) {
                    HStack {
                        Image(systemName: "hand.tap")
                        Text("Tappable Card")
                            .h4()
                    }
                }
            }
            .padding()
        }
    }
    .preferredColorScheme(.light)
}

#Preview("Glass Cards - Dark") {
    ZStack {
        LinearGradient(
            colors: [.blue, .purple, .pink],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        ScrollView {
            LazyVStack(spacing: 20) {
                Text("Glass Card Variants")
                    .h1()
                    .foregroundColor(.white)
                    .padding(.top)

                GlassCard(variant: .ultraThin) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Ultra Thin Material")
                            .h4()
                        Text("Dark mode glass effect")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }

                GlassCard(variant: .regular) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Regular Material")
                            .h4()
                        Text("Auto-adapts to dark mode")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }

                GlassCard(variant: .thick) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Thick Material")
                            .h4()
                        Text("Maximum blur and opacity")
                            .caption()
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding()
        }
    }
    .preferredColorScheme(.dark)
}
