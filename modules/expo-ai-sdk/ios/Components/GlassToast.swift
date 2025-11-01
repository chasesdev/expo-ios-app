import SwiftUI

/// Toast notification with glass background and auto-dismiss
///
/// Example usage:
/// ```swift
/// @State private var showToast = false
///
/// ZStack {
///     // Your content
///
///     if showToast {
///         GlassToast(
///             message: "Changes saved",
///             icon: "checkmark.circle.fill",
///             style: .success
///         )
///         .transition(.move(edge: .top).combined(with: .opacity))
///     }
/// }
/// .onAppear {
///     DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
///         withAnimation { showToast = true }
///         DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
///             withAnimation { showToast = false }
///         }
///     }
/// }
/// ```
struct GlassToast: View {
    @Environment(\.colorScheme) var colorScheme

    let message: String
    var icon: String? = nil
    var style: ToastStyle = .info
    var duration: TimeInterval = 3.0
    var onDismiss: (() -> Void)? = nil

    enum ToastStyle {
        case success, error, warning, info

        var iconColor: Color {
            switch self {
            case .success: return .green
            case .error: return .red
            case .warning: return .orange
            case .info: return .blue
            }
        }

        var defaultIcon: String {
            switch self {
            case .success: return "checkmark.circle.fill"
            case .error: return "xmark.circle.fill"
            case .warning: return "exclamationmark.triangle.fill"
            case .info: return "info.circle.fill"
            }
        }
    }

    var body: some View {
        HStack(spacing: DesignSystem.Spacing.sm) {
            // Icon
            Image(systemName: icon ?? style.defaultIcon)
                .foregroundColor(style.iconColor)
                .font(.body)

            // Message
            Text(message)
                .font(.body)
                .foregroundColor(Color.foreground(colorScheme))

            Spacer(minLength: 0)
        }
        .padding(.horizontal, DesignSystem.Spacing.md)
        .padding(.vertical, DesignSystem.Spacing.sm)
        .background(.regularMaterial, in: Capsule())
        .overlay(
            Capsule()
                .stroke(Color.border(colorScheme).opacity(0.5), lineWidth: 1)
        )
        .shadow(
            color: DesignSystem.Shadow.lg.color,
            radius: DesignSystem.Shadow.lg.radius,
            x: DesignSystem.Shadow.lg.x,
            y: DesignSystem.Shadow.lg.y
        )
        .padding(.horizontal, DesignSystem.Spacing.md)
        .compositingGroup()
    }
}

/// Toast manager for showing multiple toasts
class ToastManager: ObservableObject {
    @Published var toasts: [ToastItem] = []

    struct ToastItem: Identifiable {
        let id = UUID()
        let message: String
        let icon: String?
        let style: GlassToast.ToastStyle
        let duration: TimeInterval
    }

    func show(
        message: String,
        icon: String? = nil,
        style: GlassToast.ToastStyle = .info,
        duration: TimeInterval = 3.0
    ) {
        let toast = ToastItem(
            message: message,
            icon: icon,
            style: style,
            duration: duration
        )

        withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
            toasts.append(toast)
        }

        // Auto-dismiss
        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                toasts.removeAll { $0.id == toast.id }
            }
        }
    }
}

/// Toast container view
struct ToastContainer: View {
    @ObservedObject var manager: ToastManager

    var body: some View {
        VStack(spacing: 8) {
            ForEach(manager.toasts) { toast in
                GlassToast(
                    message: toast.message,
                    icon: toast.icon,
                    style: toast.style,
                    duration: toast.duration
                )
                .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .padding(.top, 50)
        .allowsHitTesting(false)
    }
}

// MARK: - Preview

#Preview("Glass Toast") {
    struct PreviewWrapper: View {
        @StateObject private var toastManager = ToastManager()

        var body: some View {
            ZStack {
                LinearGradient(
                    colors: [.blue, .purple],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                VStack(spacing: 16) {
                    GlassButton(title: "Show Success Toast", style: .primary) {
                        toastManager.show(
                            message: "Changes saved successfully!",
                            style: .success
                        )
                    }

                    GlassButton(title: "Show Error Toast", style: .destructive) {
                        toastManager.show(
                            message: "Something went wrong",
                            style: .error
                        )
                    }

                    GlassButton(title: "Show Warning Toast", style: .secondary) {
                        toastManager.show(
                            message: "Please check your settings",
                            style: .warning
                        )
                    }

                    GlassButton(title: "Show Info Toast", style: .ghost) {
                        toastManager.show(
                            message: "New messages available",
                            style: .info
                        )
                    }
                }

                ToastContainer(manager: toastManager)
            }
        }
    }

    return PreviewWrapper()
}
