from playwright.sync_api import sync_playwright, TimeoutError

URL = "https://example.com"

def run():
    with sync_playwright() as p:
        # choose browser (chromium, firefox, webkit)
        browser = p.chromium.launch(headless=True)   # headless=False to see the browser
        context = browser.new_context()               # new context = clean profile
        page = context.new_page()

        try:
            page.goto(URL, wait_until="domcontentloaded")   # fast initial wait
            # wait for the specific element that means the content is ready
            page.wait_for_selector("css=main", timeout=5000)

            # get HTML or query elements
            html = page.content()
            title = page.query_selector("h1").inner_text() if page.query_selector("h1") else None

            print("Title:", title)
            # or parse html with BeautifulSoup if you prefer
        except TimeoutError:
            print("Timed out waiting for the page.")
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    run()
