import SwiftUI

/// Example Swift UI Preview demonstrating the design system
/// This file shows how to create preview components for testing
struct ExampleButton: View {
    @Environment(\.colorScheme) var colorScheme
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.label)
                .foregroundColor(Color.primaryForeground(colorScheme))
                .padding(.horizontal, DesignSystem.Spacing.md)
                .padding(.vertical, DesignSystem.Spacing.sm)
                .background(Color.primary(colorScheme))
                .cornerRadius(DesignSystem.Radius.md)
        }
    }
}

struct ExampleCard: View {
    @Environment(\.colorScheme) var colorScheme
    let title: String
    let description: String

    var body: some View {
        VStack(alignment: .leading, spacing: DesignSystem.Spacing.sm) {
            Text(title)
                .h3()
                .foregroundColor(Color.foreground(colorScheme))

            Text(description)
                .bodyText()
                .foregroundColor(Color.mutedForeground(colorScheme))
        }
        .padding(DesignSystem.Spacing.md)
        .background(Color.card(colorScheme))
        .cornerRadius(DesignSystem.Radius.lg)
        .shadow(
            color: DesignSystem.Shadow.md.color,
            radius: DesignSystem.Shadow.md.radius,
            x: DesignSystem.Shadow.md.x,
            y: DesignSystem.Shadow.md.y
        )
    }
}

// MARK: - Previews

#Preview("Example Button - Light") {
    VStack(spacing: 20) {
        ExampleButton(title: "Primary Button") {
            print("Button tapped")
        }

        ExampleCard(
            title: "Welcome to AI SDK UI",
            description: "Native Swift UI components for AI applications"
        )
    }
    .padding()
    .background(Color.background(.light))
    .preferredColorScheme(.light)
}

#Preview("Example Button - Dark") {
    VStack(spacing: 20) {
        ExampleButton(title: "Primary Button") {
            print("Button tapped")
        }

        ExampleCard(
            title: "Welcome to AI SDK UI",
            description: "Native Swift UI components for AI applications"
        )
    }
    .padding()
    .background(Color.background(.dark))
    .preferredColorScheme(.dark)
}

#Preview("Design System Colors") {
    ScrollView {
        VStack(alignment: .leading, spacing: 12) {
            Text("Colors")
                .h2()
                .padding(.bottom, 8)

            ColorSwatch(name: "Primary", lightColor: Color.Light.primary, darkColor: Color.Dark.primary)
            ColorSwatch(name: "Secondary", lightColor: Color.Light.secondary, darkColor: Color.Dark.secondary)
            ColorSwatch(name: "Accent", lightColor: Color.Light.accent, darkColor: Color.Dark.accent)
            ColorSwatch(name: "Destructive", lightColor: Color.Light.destructive, darkColor: Color.Dark.destructive)
            ColorSwatch(name: "Muted", lightColor: Color.Light.muted, darkColor: Color.Dark.muted)
        }
        .padding()
    }
}

struct ColorSwatch: View {
    let name: String
    let lightColor: Color
    let darkColor: Color
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack {
            RoundedRectangle(cornerRadius: 8)
                .fill(colorScheme == .dark ? darkColor : lightColor)
                .frame(width: 60, height: 60)

            VStack(alignment: .leading) {
                Text(name)
                    .font(.label)
                Text(colorScheme == .dark ? "Dark" : "Light")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
    }
}
