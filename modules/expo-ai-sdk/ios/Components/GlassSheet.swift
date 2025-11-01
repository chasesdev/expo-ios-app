import SwiftUI

/// Bottom sheet with glass background and drag-to-dismiss
///
/// Example usage:
/// ```swift
/// @State private var showSheet = false
///
/// Button("Show Sheet") { showSheet = true }
///     .sheet(isPresented: $showSheet) {
///         GlassSheet(
///             title: "Sheet Title",
///             onDismiss: { showSheet = false }
///         ) {
///             VStack { /* content */ }
///         }
///     }
/// ```
struct GlassSheet<Content: View>: View {
    @Environment(\.colorScheme) var colorScheme
    @State private var dragOffset: CGFloat = 0

    let title: String?
    let content: () -> Content
    let onDismiss: () -> Void

    var showHandle: Bool = true
    var detents: Set<PresentationDetent> = [.medium, .large]

    init(
        title: String? = nil,
        showHandle: Bool = true,
        detents: Set<PresentationDetent> = [.medium, .large],
        onDismiss: @escaping () -> Void,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.title = title
        self.showHandle = showHandle
        self.detents = detents
        self.onDismiss = onDismiss
        self.content = content
    }

    var body: some View {
        VStack(spacing: 0) {
            // Drag handle
            if showHandle {
                Capsule()
                    .fill(Color.secondary.opacity(0.3))
                    .frame(width: 40, height: 5)
                    .padding(.top, DesignSystem.Spacing.xs)
                    .padding(.bottom, DesignSystem.Spacing.sm)
            }

            // Header
            if let title = title {
                HStack {
                    Text(title)
                        .h3()
                        .foregroundColor(Color.foreground(colorScheme))

                    Spacer()

                    Button(action: onDismiss) {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(.secondary)
                            .font(.title3)
                    }
                }
                .padding(.horizontal, DesignSystem.Spacing.md)
                .padding(.bottom, DesignSystem.Spacing.sm)
            }

            // Content
            ScrollView {
                content()
                    .padding(.horizontal, DesignSystem.Spacing.md)
                    .padding(.bottom, DesignSystem.Spacing.xl)
            }
        }
        .background(.regularMaterial)
        .presentationDetents(detents)
        .presentationDragIndicator(showHandle ? .hidden : .visible)
        .presentationCornerRadius(DesignSystem.Radius.xl)
        .interactiveDismissDisabled(false)
    }
}

// MARK: - Preview

#Preview("Glass Sheet") {
    struct PreviewWrapper: View {
        @State private var showSheet = false

        var body: some View {
            ZStack {
                LinearGradient(
                    colors: [.blue, .purple],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                Button("Show Sheet") {
                    showSheet = true
                }
                .buttonStyle(.borderedProminent)
            }
            .sheet(isPresented: $showSheet) {
                GlassSheet(
                    title: "Settings",
                    onDismiss: { showSheet = false }
                ) {
                    LazyVStack(alignment: .leading, spacing: 16) {
                        ForEach(0..<10) { index in
                            HStack {
                                Image(systemName: "gearshape")
                                Text("Setting \(index + 1)")
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(.tertiary)
                            }
                            .padding(.vertical, 8)

                            if index < 9 {
                                Divider()
                            }
                        }
                    }
                }
            }
        }
    }

    return PreviewWrapper()
}
