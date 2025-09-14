export const EmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Architects+Daughter&display=swap" rel="stylesheet">
    <style>
        /* Basic styles for email client compatibility */
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        table, td, div, h1, p {
            font-family: 'Nunito', sans-serif;
        }
        /* --- Mobile Responsive Styles --- */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .header-title {
                font-size: 2.25rem !important;
            }
            .banner-title {
                font-size: 1.25rem !important;
                line-height: 1.5rem !important;
            }
            .main-content {
                padding: 0 1rem !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 1.25rem 0;">
                <!-- Main Container Table -->
                <table class="container" width="90%" border="0" cellspacing="0" cellpadding="0" style="max-width: 42rem; background-color: #ffffff; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 2rem 1rem;">
                            <h1 class="header-title" style="font-family: 'Architects Daughter', cursive; font-size: 3rem; color: #343a40; font-weight: 800; margin: 0;">
                                Sketch
                            </h1>
                        </td>
                    </tr>
                    <!-- Blue Banner -->
                    <tr>
                        <td align="center" style="background-color: #6965db; color: #ffffff; padding: 2rem 1rem;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="center">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td><div style="width: 2.5rem; height: 1px; background-color: #ffffff;"></div></td>
                                                <td style="padding: 0 0.75rem;">
                                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path>
                                                    </svg>
                                                </td>
                                                <td><div style="width: 2.5rem; height: 1px; background-color: #ffffff;"></div></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 1.25rem; font-size: 1.125rem; letter-spacing: 0.1em; font-weight: 400;" class="banner-subtitle">
                                        THANKS FOR SIGNING UP!
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 0.75rem; font-size: 1.875rem; letter-spacing: 0.05em; font-weight: 700; text-transform: capitalize;" class="banner-title">
                                        Verify your E-mail Address
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Main Content -->
                    <tr>
                        <td class="main-content" style="padding: 0 2.5rem; margin-top: 2rem;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr><td style="height: 2rem;"></td></tr>
                                <tr>
                                    <td>
                                        <h2 style="color: #374151; font-weight: normal; margin: 0;">{username},</h2>
                                        <p style="margin-top: 0.5rem; line-height: 1.75; color: #4B5563;">
                                            Please use the following One Time Password(OTP)
                                        </p>
                                        <p style="display: inline-block; padding: 0.5rem 1rem; font-size: 1.5rem; font-weight: 500; color: #6965db; border: 1px solid #6965db; border-radius: 0.375rem; margin: 1rem 0;">
                                            {verification_code}
                                        </p>
                                        <p style="margin-top: 1rem; line-height: 1.75; color: #4B5563;">
                                            This passcode will only be valid for the next
                                            <span style="font-weight: 700;"> 15 minutes</span>.
                                        </p>
                                        <p style="margin-top: 2rem; color: #4B5563;">
                                            Thank you, <br />
                                            Ankit Panwar
                                        </p>
                                    </td>
                                </tr>
                                <tr><td style="height: 2rem;"></td></tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <!-- Footer Content -->
                                <tr>
                                    <td align="center" style="background-color: rgba(209, 213, 219, 0.6); padding: 1.5rem 1rem;">
                                        <h1 style="color: #6965db; font-weight: 600; letter-spacing: 0.05em; font-size: 1.125rem; margin:0;">
                                            Get in touch
                                        </h1>
                                        <p style="color: #6B7280; margin: 0.5rem 0; font-size: 0.875rem;">ankitpam321@gmail.com</p>
                                        <div>
                                            <a href="#_" style="text-decoration: none; display: inline-block; padding: 0 0.375rem;">
                                                <img src="https://img.icons8.com/ios-filled/50/aaaaaa/facebook-new.png" alt="Facebook" width="18" height="18"/>
                                            </a>
                                            <a href="#_" style="text-decoration: none; display: inline-block; padding: 0 0.375rem;">
                                                <img src="https://img.icons8.com/ios-filled/50/aaaaaa/linkedin.png" alt="LinkedIn" width="18" height="18"/>
                                            </a>
                                            <a href="#_" style="text-decoration: none; display: inline-block; padding: 0 0.375rem;">
                                                <img src="https://img.icons8.com/ios-filled/50/aaaaaa/instagram-new.png" alt="Instagram" width="18" height="18"/>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                <!-- Copyright -->
                                <tr>
                                    <td align="center" style="background-color: #6965db; padding: 1.25rem; color: #ffffff; font-size: 0.875rem;">
                                        <p style="margin: 0;">© 2025 sketch. All Rights Reserved.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>


`;
