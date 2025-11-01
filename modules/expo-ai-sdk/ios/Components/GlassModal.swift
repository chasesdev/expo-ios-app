import SwiftUI

/// Full-screen modal with blur overlay and glass content container
///
/// Example usage:
/// ```swift
/// @State private var showModal = false
///
/// Button("Show Modal") {
///     showModal = true
/// }
/// .overlay(
///     showModal ? GlassModal(isPresented: $showModal) {
///         VStack {
///             Text("Modal Content")
///             Button("Close") { showModal = false }
///         }
///     } : nil
/// )
/// ```
struct GlassModal<Content: View>: View {
    @Environment(\.colorScheme) var colorScheme
    @Binding var isPresented: Bool
    let content: () -> Content

    var title: String? = nil
    var showCloseButton: Bool = true
    var backgroundDismiss: Bool = true

    var body: some View {
        ZStack {
            // Dimmed blur background
            Color.black.opacity(0.4)
                .blur(radius: 10)
                .ignoresSafeArea()
                .onTapGesture {
                    if backgroundDismiss {
                        withAnimation(.easeOut(duration: 0.3)) {
                            isPresented = false
                        }
                    }
                }

            // Glass modal container
            VStack(spacing: 0) {
                // Header with close button
                if showCloseButton || title != nil {
                    HStack {
                        if let title = title {
                            Text(title)
                                .h3()
                                .foregroundColor(Color.foreground(colorScheme))
                        }

                        Spacer()

                        if showCloseButton {
                            Button(action: {
                                withAnimation(.easeOut(duration: 0.3)) {
                                    isPresented = false
                                }
                            }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.secondary)
                                    .font(.title2)
                            }
                        }
                    }
                    .padding(DesignSystem.Spacing.md)
                }

                // Content
                ScrollView {
                    content()
                        .padding(.horizontal, DesignSystem.Spacing.md)
                        .padding(.bottom, DesignSystem.Spacing.lg)
                }
            }
            .background(.thickMaterial)
            .clipShape(RoundedRectangle(cornerRadius: DesignSystem.Radius.xl))
            .overlay(
                RoundedRectangle(cornerRadius: DesignSystem.Radius.xl)
                    .stroke(Color.border(colorScheme).opacity(0.3), lineWidth: 1)
            )
            .shadow(
                color: .black.opacity(0.3),
                radius: 30,
                x: 0,
                y: 10
            )
            .padding(DesignSystem.Spacing.xl)
            .transition(.scale.combined(with: .opacity))
            .compositingGroup()
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: isPresented)
    }
}

// MARK: - Convenience Modal Styles

/// Alert-style glass modal with title and actions
struct GlassAlert<Content: View>: View {
    @Environment(\.colorScheme) var colorScheme
    @Binding var isPresented: Bool
    let title: String
    let message: String?
    let content: (() -> Content)?
    let primaryAction: (title: String, action: () -> Void)?
    let secondaryAction: (title: String, action: () -> Void)?

    init(
        isPresented: Binding<Bool>,
        title: String,
        message: String? = nil,
        @ViewBuilder content: @escaping () -> Content = { EmptyView() },
        primaryAction: (title: String, action: () -> Void)? = nil,
        secondaryAction: (title: String, action: () -> Void)? = nil
    ) {
        self._isPresented = isPresented
        self.title = title
        self.message = message
        self.content = content
        self.primaryAction = primaryAction
        self.secondaryAction = secondaryAction
    }

    var body: some View {
        ZStack {
            Color.black.opacity(0.4)
                .ignoresSafeArea()

            VStack(spacing: DesignSystem.Spacing.lg) {
                // Title & Message
                VStack(spacing: DesignSystem.Spacing.sm) {
                    Text(title)
                        .h3()
                        .multilineTextAlignment(.center)

                    if let message = message {
                        Text(message)
                            .bodyText()
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    }
                }

                // Custom content
                if let content = content {
                    content()
                }

                // Actions
                if primaryAction != nil || secondaryAction != nil {
                    VStack(spacing: DesignSystem.Spacing.sm) {
                        if let primary = primaryAction {
                            GlassButton(
                                title: primary.title,
                                style: .primary,
                                fullWidth: true
                            ) {
                                primary.action()
                                isPresented = false
                            }
                        }

                        if let secondary = secondaryAction {
                            GlassButton(
                                title: secondary.title,
                                style: .ghost,
                                fullWidth: true
                            ) {
                                secondary.action()
                                isPresented = false
                            }
                        }
                    }
                }
            }
            .padding(DesignSystem.Spacing.lg)
            .frame(maxWidth: 400)
            .frame(minWidth: 280)
            .background(.thickMaterial)
            .clipShape(RoundedRectangle(cornerRadius: DesignSystem.Radius.xl))
            .overlay(
                RoundedRectangle(cornerRadius: DesignSystem.Radius.xl)
                    .stroke(Color.border(colorScheme).opacity(0.3), lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.3), radius: 30)
            .transition(.scale.combined(with: .opacity))
            .compositingGroup()
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: isPresented)
    }
}

// MARK: - Previews

#Preview("Glass Modal - Light") {
    struct PreviewWrapper: View {
        @State private var showModal = false

        var body: some View {
            ZStack {
                LinearGradient(
                    colors: [.blue, .purple],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                Button("Show Modal") {
                    showModal = true
                }
                .buttonStyle(.borderedProminent)

                if showModal {
                    GlassModal(isPresented: $showModal, title: "Modal Title") {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Modal Content")
                                .h4()

                            Text("This is a full-screen modal with glass effects. Tap outside or press the X to dismiss.")
                                .bodyText()
                                .foregroundStyle(.secondary)

                            Divider()

                            ForEach(0..<5) { index in
                                HStack {
                                    Image(systemName: "\(index + 1).circle.fill")
                                    Text("Item \(index + 1)")
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .foregroundStyle(.tertiary)
                                }
                                .padding(.vertical, 8)
                            }
                        }
                    }
                }
            }
            .preferredColorScheme(.light)
        }
    }

    return PreviewWrapper()
}

#Preview("Glass Alert - Dark") {
    struct PreviewWrapper: View {
        @State private var showAlert = false

        var body: some View {
            ZStack {
                LinearGradient(
                    colors: [.blue, .purple],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                Button("Show Alert") {
                    showAlert = true
                }
                .buttonStyle(.borderedProminent)

                if showAlert {
                    GlassAlert(
                        isPresented: $showAlert,
                        title: "Confirm Action",
                        message: "Are you sure you want to proceed with this action?",
                        primaryAction: (
                            title: "Confirm",
                            action: { print("Confirmed") }
                        ),
                        secondaryAction: (
                            title: "Cancel",
                            action: { print("Cancelled") }
                        )
                    )
                }
            }
            .preferredColorScheme(.dark)
        }
    }

    return PreviewWrapper()
}
