import SwiftUI

/// Interactive glass button with press animation and haptic feedback
///
/// Example usage:
/// ```swift
/// GlassButton(title: "Submit", style: .primary) {
///     print("Button tapped")
/// }
/// ```
struct GlassButton: View {
    @Environment(\.colorScheme) var colorScheme
    @State private var isPressed = false

    let title: String
    let action: () -> Void
    var style: ButtonStyleType = .primary
    var systemImage: String? = nil
    var fullWidth: Bool = false

    enum ButtonStyleType {
        case primary, secondary, destructive, ghost

        func foregroundColor(_ colorScheme: ColorScheme) -> Color {
            switch self {
            case .primary:
                return Color.primaryForeground(colorScheme)
            case .secondary:
                return Color.secondaryForeground(colorScheme)
            case .destructive:
                return Color.destructiveForeground(colorScheme)
            case .ghost:
                return Color.foreground(colorScheme)
            }
        }

        func backgroundColor(_ colorScheme: ColorScheme) -> Color {
            switch self {
            case .primary:
                return Color.primary(colorScheme)
            case .secondary:
                return Color.secondary(colorScheme)
            case .destructive:
                return Color.destructive(colorScheme)
            case .ghost:
                return Color.clear
            }
        }

        var material: Material {
            .regularMaterial
        }
    }

    var body: some View {
        Button(action: {
            // Haptic feedback
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()

            action()
        }) {
            HStack(spacing: DesignSystem.Spacing.sm) {
                if let systemImage = systemImage {
                    Image(systemName: systemImage)
                        .font(.body)
                }

                Text(title)
                    .font(.label)
            }
            .foregroundColor(style.foregroundColor(colorScheme))
            .padding(.horizontal, DesignSystem.Spacing.md)
            .padding(.vertical, DesignSystem.Spacing.sm)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .background(
                Group {
                    if style == .ghost {
                        style.material
                    } else {
                        style.backgroundColor(colorScheme)
                            .background(style.material)
                    }
                },
                in: Capsule()
            )
            .overlay(
                Capsule()
                    .stroke(Color.border(colorScheme).opacity(0.5), lineWidth: 1)
            )
            .shadow(
                color: DesignSystem.Shadow.sm.color,
                radius: DesignSystem.Shadow.sm.radius,
                x: DesignSystem.Shadow.sm.x,
                y: DesignSystem.Shadow.sm.y
            )
        }
        .buttonStyle(.plain)
        .scaleEffect(isPressed ? 0.95 : 1.0)
        .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isPressed)
        .simultaneousGesture(
            DragGesture(minimumDistance: 0)
                .onChanged { _ in isPressed = true }
                .onEnded { _ in isPressed = false }
        )
        .compositingGroup()
    }
}

// MARK: - Previews

#Preview("Glass Buttons - Light") {
    ZStack {
        LinearGradient(
            colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        VStack(spacing: 16) {
            Text("Glass Buttons")
                .h2()
                .padding(.bottom)

            // Primary
            GlassButton(title: "Primary Button", style: .primary) {
                print("Primary tapped")
            }

            // Secondary
            GlassButton(title: "Secondary Button", style: .secondary) {
                print("Secondary tapped")
            }

            // Destructive
            GlassButton(title: "Destructive Button", style: .destructive) {
                print("Destructive tapped")
            }

            // Ghost
            GlassButton(title: "Ghost Button", style: .ghost) {
                print("Ghost tapped")
            }

            // With icon
            GlassButton(
                title: "With Icon",
                style: .primary,
                systemImage: "paperplane.fill"
            ) {
                print("Icon button tapped")
            }

            // Full width
            GlassButton(
                title: "Full Width",
                style: .primary,
                fullWidth: true
            ) {
                print("Full width tapped")
            }
        }
        .padding()
    }
    .preferredColorScheme(.light)
}

#Preview("Glass Buttons - Dark") {
    ZStack {
        LinearGradient(
            colors: [.blue.opacity(0.3), .purple.opacity(0.3)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()

        VStack(spacing: 16) {
            Text("Glass Buttons")
                .h2()
                .foregroundColor(.white)
                .padding(.bottom)

            GlassButton(title: "Primary", style: .primary) {}
            GlassButton(title: "Secondary", style: .secondary) {}
            GlassButton(title: "Destructive", style: .destructive) {}
            GlassButton(title: "Ghost", style: .ghost) {}

            GlassButton(
                title: "Send Message",
                style: .primary,
                systemImage: "paperplane.fill",
                fullWidth: true
            ) {}
        }
        .padding()
    }
    .preferredColorScheme(.dark)
}
