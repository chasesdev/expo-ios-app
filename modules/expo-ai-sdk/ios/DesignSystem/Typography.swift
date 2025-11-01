import SwiftUI

/// Typography system matching the web app's design
extension Font {
    // MARK: - Display

    static let display = Font.system(size: 36, weight: .bold)
        .leading(.tight)

    // MARK: - Headings

    static let h1 = Font.system(size: 30, weight: .bold)
        .leading(.tight)

    static let h2 = Font.system(size: 24, weight: .semibold)
        .leading(.tight)

    static let h3 = Font.system(size: 20, weight: .semibold)

    static let h4 = Font.system(size: 18, weight: .semibold)

    // MARK: - Body

    static let body = Font.system(size: 16, weight: .regular)

    static let bodySmall = Font.system(size: 14, weight: .regular)

    // MARK: - UI

    static let label = Font.system(size: 14, weight: .medium)

    static let caption = Font.system(size: 12, weight: .regular)

    static let overline = Font.system(size: 11, weight: .medium)
        .tracking(0.5)

    // MARK: - Code

    static let code = Font.system(size: 14, weight: .regular, design: .monospaced)

    static let codeSmall = Font.system(size: 12, weight: .regular, design: .monospaced)
}

/// Text style modifiers
extension Text {
    func display() -> Text {
        self.font(.display)
    }

    func h1() -> Text {
        self.font(.h1)
    }

    func h2() -> Text {
        self.font(.h2)
    }

    func h3() -> Text {
        self.font(.h3)
    }

    func h4() -> Text {
        self.font(.h4)
    }

    func bodyText() -> Text {
        self.font(.body)
    }

    func bodySmall() -> Text {
        self.font(.bodySmall)
    }

    func label() -> Text {
        self.font(.label)
    }

    func caption() -> Text {
        self.font(.caption)
    }

    func overline() -> Text {
        self.font(.overline)
    }

    func code() -> Text {
        self.font(.code)
    }
}
