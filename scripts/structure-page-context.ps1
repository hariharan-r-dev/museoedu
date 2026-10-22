param([string]$ContextDir = "page-context")

$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)

$heroMap = @{
    'home.md' = @('Museum Education & Digital Transformation','Bringing Stories to Life Through Innovative Museum Experiences')
    'about.md' = @('About Museoedu','Bridging History and Technology')
    'museumprofessionals.md' = @('For Museum Professionals','Our Services for Museum Professionals')
    'museumvisitors.md' = @('For Museum Visitors','Explore Our Visitor Services')
    'lms.md' = @('Learning Management Systems','Learning That Extends Beyond the Museum')
    'blank-3.md' = @('LMS for Professionals','Empowering Museum Professionals with Tailored Educational Tools')
    'blank-3-1.md' = @('LMS for Visitors','Transforming Museum Visits into Interactive Educational Journeys')
    'blogs.md' = @('Museoedu Insights','Museum Ideas, Technology, and Education')
    'events.md' = @('Museoedu Events','Explore Upcoming Museum Experiences')
    'event-list.md' = @('Museoedu Events','Explore Upcoming Museum Experiences')
    'faq.md' = @('Frequently Asked Questions','Answers About Museoedu Services')
    'book-online.md' = @('Book Online','Connect With Museoedu')
    'blank-6.md' = @('Contact Museoedu','Let’s Create Better Museum Experiences')
}

$embeddedHeadings = @(
    'About Us','Mission Statement','Vision Statement','Our Approach to Technology','Values','Our Team','Reducing the Carbon Footprint',
    'What we do','Educational Enrichment and Accessibility','Pioneering Digital Transformation','Global Collaboration and Enhancement',
    'Our Exciting Events','Members Past Collaborations','Future Museum Innovations','Technologies & Platforms','Frequently Asked Questions','Historical Topics',
    'Digital Strategy Consulting','Virtual Exhibition Development','Interactive Display Solutions','Collection Digitization','Digital Archiving',
    'Staff Training Programs','Learning Management System Creation','SCORM Content Development','Digital Docent Development','Exhibit Enhancement Tools',
    'Digital Visitor Feedback Systems','Augmented Reality Apps','Visitor Analytics Solutions','Online Education Modules','Membership & Loyalty Programs',
    'Digital Fundraising Platforms','Webinar and Workshop Hosting','Sustainability Consulting','Crisis Communication Tools','Accessibility Enhancements',
    'Virtual Museum Tours','Educational Gaming','Customized Visitor Guides','Artwork Augmentation','Digital Learning Hubs','Augmented Learning Trails',
    'Virtual Reality Learning Experiences','Interactive Lecture Series','Cultural Competency Modulesz','Language Translation Services',
    'Social Sharing Features','Event Notifications','Family-Friendly Routes','Accessibility Routes','360-Degree Video Experiences',
    'Interactive Q&A Sessions','Mobile Food Ordering','E-Ticketing Solutions','Art-Making Workshops Onlines','Personalized Art Recommends',
    'Overview','Service Description','Comprehensive Course Management','Interactive Learning Modules','Progress Tracking and Reporting',
    'Mobile Compatibility','Integration Capabilities','Benefits to Museum Professionals','Skill Enhancement','Flexible Learning','Increased Engagement',
    'Cost-Effective Training','Conclusion','Time & Location','Share this event'
) | Sort-Object Length -Descending -Unique

function Repair-Text([string]$value) {
    if ($null -eq $value) { return '' }
    $badApostrophe = ([string][char]0x00E2) + [char]0x20AC + [char]0x2122
    $badLeftQuote = ([string][char]0x00E2) + [char]0x20AC + [char]0x0153
    $badRightQuote = ([string][char]0x00E2) + [char]0x20AC + [char]0x009D
    $badEnDash = ([string][char]0x00E2) + [char]0x20AC + [char]0x201C
    $badEmDash = ([string][char]0x00E2) + [char]0x20AC + [char]0x201D
    $badTrademark = ([string][char]0x00E2) + [char]0x201E + [char]0x00A2
    $badCopyright = ([string][char]0x00C2) + [char]0x00A9
    $value = $value.Replace($badApostrophe, "'").Replace($badLeftQuote, '"').Replace($badRightQuote, '"')
    $value = $value.Replace($badEnDash, '-').Replace($badEmDash, '-').Replace($badTrademark, 'TM')
    $value = $value.Replace($badCopyright, '(c)').Replace([string][char]0x00C2, '')
    $value = $value -replace '[ \t]+$', ''
    return $value.Trim()
}

function Clean-Title([string]$title) {
    $title = Repair-Text $title
    return ($title -replace '\s*\|\s*MuseoEdu\s*$','').Trim()
}

function Get-DefaultEyebrow([string]$pageType, [string]$fileName) {
    if ($pageType -eq 'Article') { return 'Museum Insights' }
    if ($pageType -eq 'Event detail') { return 'Museoedu Events' }
    if ($pageType -eq 'Member profile') { return 'Museoedu Community' }
    if ($fileName -match '^blogs') { return 'Museum Insights' }
    return 'Museoedu'
}

function Add-Section($lines, [string]$heading, $paragraphs, $items) {
    if ([string]::IsNullOrWhiteSpace($heading) -and $paragraphs.Count -eq 0 -and $items.Count -eq 0) { return }
    $lines.Add("### $heading")
    $lines.Add('')
    $lines.Add('- **Content type:** Content section')
    $lines.Add("- **Heading:** $heading")
    if ($paragraphs.Count -gt 0) {
        $lines.Add('- **Paragraph:**')
        $lines.Add('')
        foreach ($paragraph in $paragraphs) { $lines.Add("  $paragraph"); $lines.Add('') }
    }
    if ($items.Count -gt 0) {
        $lines.Add('- **List items:**')
        foreach ($item in $items) { $lines.Add("  - $item") }
        $lines.Add('')
    }
}

$files = @(Get-ChildItem -LiteralPath $ContextDir -File -Filter '*.md' | Where-Object Name -ne 'README.md')
foreach ($file in $files) {
    $raw = [IO.File]::ReadAllText($file.FullName)
    $title = Clean-Title ([regex]::Match($raw, '(?m)^#\s+(.+)$').Groups[1].Value)
    $source = Repair-Text ([regex]::Match($raw, '(?m)^- \*\*Source:\*\*\s+(.+)$').Groups[1].Value)
    $pageType = Repair-Text ([regex]::Match($raw, '(?m)^- \*\*Page type:\*\*\s+(.+)$').Groups[1].Value)
    $status = Repair-Text ([regex]::Match($raw, '(?m)^- \*\*Retrieval status:\*\*\s+(.+)$').Groups[1].Value)
    $context = Repair-Text ([regex]::Match($raw, '(?m)^- \*\*Context:\*\*\s+(.+)$').Groups[1].Value)
    $seo = Repair-Text ([regex]::Match($raw, '(?m)^- \*\*SEO description:\*\*\s+(.+)$').Groups[1].Value)

    $bodyMatch = [regex]::Match($raw, '(?s)^## Extracted page copy\s*(.*)$', 'Multiline')
    $body = if ($bodyMatch.Success) { $bodyMatch.Groups[1].Value } else { '' }
    $body = Repair-Text $body

    # Remove Wix navigation/build chrome while retaining the first real content after the Events nav item.
    $body = [regex]::Replace($body, '(?s)^-\s*-->.*?(?:^|\r?\n)-?\s*Events\s*', '', 'IgnoreCase,Multiline')
    $body = [regex]::Replace($body, '(?s)^-\s*-->.*?\bEvents\b\s*', '', 'IgnoreCase')
    $body = $body -replace '(?m)^\s*(top of page|Built on|Home|About|ServiceHub|For Visitors|For Professional|LMS|Events)\s*$',''

    # Cut the repeated global footer, but do not remove an About page's opening heading.
    $footerMatch = [regex]::Match($body, '(?ms)^###\s+About Us\s*\r?\n\s*###\s+Blogs\s*\r?\n\s*###\s+FAQs')
    if ($footerMatch.Success) { $body = $body.Substring(0, $footerMatch.Index) }
    $body = [regex]::Replace($body, '(?ms)^MUSEO EDU\s*.*$', '')

    # Restore service/card titles that Wix flattened into surrounding paragraphs.
    foreach ($heading in $embeddedHeadings) {
        $escaped = [regex]::Escape($heading)
        $body = [regex]::Replace($body, "(?<![#\w])$escaped(?=\s+)", "`n### $heading`n`n", 'IgnoreCase')
    }
    $body = $body -replace '(?m)^\s*-\s*(Home|About|ServiceHub|For Visitors|For Professional|LMS|Events)\s*$',''
    $body = [regex]::Replace($body, '(?m)^\s*©\s*\d{4}.*$', '')
    $body = [regex]::Replace($body, '(?m)^\s*-\s*>\s*$', '')

    $eyebrow = Get-DefaultEyebrow $pageType $file.Name
    $heroHeading = $title
    if ($heroMap.ContainsKey($file.Name)) {
        $eyebrow = $heroMap[$file.Name][0]
        $heroHeading = $heroMap[$file.Name][1]
    }
    $subtext = if (-not [string]::IsNullOrWhiteSpace($seo)) { $seo } else { $context }

    $output = New-Object System.Collections.Generic.List[string]
    $output.Add("# $title")
    $output.Add('')
    $output.Add('## Page information')
    $output.Add('')
    $output.Add("- **Source:** $source")
    $output.Add("- **Page type:** $pageType")
    $output.Add("- **Retrieval status:** $status")
    $output.Add("- **Purpose:** $context")
    $output.Add('')
    $output.Add('## Hero')
    $output.Add('')
    $output.Add("- **Eyebrow:** $eyebrow")
    $output.Add("- **Heading:** $heroHeading")
    $output.Add("- **Subtext:** $subtext")
    $output.Add('')
    $output.Add('## Page content')
    $output.Add('')

    if ([string]::IsNullOrWhiteSpace($body) -or $body -match '^_No meaningful public') {
        $output.Add('_No additional public page copy was available._')
    } else {
        $currentHeading = 'Introductory copy'
        $paragraphs = New-Object System.Collections.Generic.List[string]
        $items = New-Object System.Collections.Generic.List[string]
        $lines = @($body -split '\r?\n')
        foreach ($rawLine in $lines) {
            $line = Repair-Text $rawLine
            if ([string]::IsNullOrWhiteSpace($line)) { continue }
            if ($line -match '^#{2,6}\s+(.+)$') {
                Add-Section $output $currentHeading $paragraphs $items
                $currentHeading = Repair-Text $Matches[1]
                $paragraphs = New-Object System.Collections.Generic.List[string]
                $items = New-Object System.Collections.Generic.List[string]
                continue
            }
            if ($line -match '^(.{2,80}):$') {
                Add-Section $output $currentHeading $paragraphs $items
                $currentHeading = Repair-Text $Matches[1]
                $paragraphs = New-Object System.Collections.Generic.List[string]
                $items = New-Object System.Collections.Generic.List[string]
                continue
            }
            if ($line -match '^[-*]\s+(.+)$') { $items.Add((Repair-Text $Matches[1])); continue }
            if ($line -eq $heroHeading -or $line -eq $title) { continue }
            $paragraphs.Add($line)
        }
        Add-Section $output $currentHeading $paragraphs $items
    }
    [IO.File]::WriteAllLines($file.FullName, $output, $utf8)
}

Write-Output "Structured $($files.Count) page-context files."
