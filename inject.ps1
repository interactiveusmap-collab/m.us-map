$html = @"
    <!-- OVERLAY MENU -->
    <div class="menu-overlay" id="mobileMenu">
        <div class="close-menu" id="closeBtn">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
        </div>
        <nav class="menu-content">
            <a href="index.html" class="menu-link">States</a>
            <a href="regions.html" class="menu-link">Regions</a>
            <hr style="width: 40px; border: 0; border-top: 2px solid rgba(255,255,255,0.1); margin: 10px auto;">
            <a href="about.html" class="menu-link">About Us</a>
            <a href="contact.html" class="menu-link">Get in Touch</a>
            <a href="privacy_policy.html" class="menu-link">Privacy Policy</a>
            <div style="margin-top: 40px; color: rgba(255,255,255,0.4); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                Interactive US Map
            </div>
        </nav>
    </div>

    <!-- HAMBURGER TRIGGER -->
    <div class="menu-trigger" id="menuBtn">
        <span></span>
        <span></span>
        <span></span>
    </div>
"@

Get-ChildItem -Path "c:\Users\jeffr\Desktop\Codes\Run\US States\Mobile" -Filter "*.html" | ForEach-Object {
    if ($_.Name -ne "menu_test.html") {
        $content = Get-Content -Path $_.FullName -Raw -Encoding UTF8
        if ($content -notmatch 'id="mobileMenu"') {
            $content = $content.Replace("<body>", ("<body>`n" + $html))
            Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
        }
    }
}
