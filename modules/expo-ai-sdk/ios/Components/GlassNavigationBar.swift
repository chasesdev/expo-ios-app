import SwiftUI

/// Glass navigation bar with system-optimized .bar material
///
/// Example usage:
/// ```swift
/// VStack(spacing: 0) {
///     GlassNavigationBar(
///         title: "Screen Title",
///         leadingButton: { /* back action */ },
///         trailingButton: { /* menu action */ }
///     )
///     ScrollView { /* content */ }
/// }
/// ```
struct GlassNavigationBar: View {
    @Environment(\.colorScheme) var colorScheme

    let title: String
    var leadingIcon: String = "chevron.left"
    var trailingIcon: String = "ellipsis"
    var leadingButton: (() -> Void)? = nil
    var trailingButton: (() -> Void)? = nil
    var showDivider: Bool = true

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: DesignSystem.Spacing.md) {
                // Leading button
                if let action = leadingButton {
                    Button(action: action) {
                        Image(systemName: leadingIcon)
                            .foregroundColor(Color.foreground(colorScheme))
                            .font(.body.weight(.semibold))
                            .frame(width: 24, height: 24)
                    }
                } else {
                    Spacer().frame(width: 24)
                }

                Spacer()

                // Title
                Text(title)
                    .font(.headline)
                    .foregroundColor(Color.foreground(colorScheme))

                Spacer()

                // Trailing button
                if let action = trailingButton {
                    Button(action: action) {
                        Image(systemName: trailingIcon)
                            .foregroundColor(Color.foreground(colorScheme))
                            .font(.body.weight(.semibold))
                            .frame(width: 24, height: 24)
                    }
                } else {
                    Spacer().frame(width: 24)
                }
            }
            .padding(.horizontal, DesignSystem.Spacing.md)
            .padding(.vertical, DesignSystem.Spacing.sm)
            .background(.bar)

            // Divider
            if showDivider {
                Divider()
            }
        }
    }
}

// MARK: - Preview

#Preview("Glass Navigation Bar - Light") {
    VStack(spacing: 0) {
        GlassNavigationBar(
            title: "Messages",
            leadingButton: { print("Back") },
            trailingButton: { print("Menu") }
        )

        ScrollView {
            VStack(spacing: 12) {
                ForEach(0..<20) { index in
                    GlassCard(variant: .ultraThin) {
                        HStack {
                            Circle()
                                .fill(Color.blue)
                                .frame(width: 40, height: 40)

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Message \(index + 1)")
                                    .font(.body.weight(.semibold))
                                Text("Preview text...")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }

                            Spacer()
                        }
                    }
                }
            }
            .padding()
        }
        .background(
            LinearGradient(
                colors: [.blue.opacity(0.1), .purple.opacity(0.1)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
    .preferredColorScheme(.light)
}

#Preview("Glass Navigation Bar - Dark") {
    VStack(spacing: 0) {
        GlassNavigationBar(
            title: "Settings",
            leadingButton: { print("Back") },
            trailingButton: { print("Menu") }
        )

        ScrollView {
            VStack(spacing: 12) {
                ForEach(0..<20) { index in {
                    GlassCard(variant: .ultraThin) {
                        HStack {
                            Image(systemName: "gearshape")
                                .font(.title2)
                                .foregroundStyle(.secondary)

                            Text("Setting \(index + 1)")
                                .font(.body)

                            Spacer()

                            Image(systemName: "chevron.right")
                                .foregroundStyle(.tertiary)
                        }
                    }
                }
            }
            .padding()
        }
        .background(
            LinearGradient(
                colors: [.blue.opacity(0.1), .purple.opacity(0.1)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
    .preferredColorScheme(.dark)
}
