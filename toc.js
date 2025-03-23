// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">簡介</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded "><a href="chapter-1/index.html"><strong aria-hidden="true">1.</strong> 戰術的基本</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter-1/section-1-fundamentals.html"><strong aria-hidden="true">1.1.</strong> 👷 步兵排與班的作戰基本</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">1.2.</strong> 🚧 教條與訓練</a></li><li class="chapter-item expanded "><a href="chapter-1/section-3-organization.html"><strong aria-hidden="true">1.3.</strong> 組織</a></li><li class="chapter-item expanded "><a href="chapter-1/section-4-combinations.html"><strong aria-hidden="true">1.4.</strong> 聯合</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">1.5.</strong> 🚧 個人領導</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">1.6.</strong> 🚧 戰術決策</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">1.7.</strong> 🚧 戰鬥力</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">1.8.</strong> 🚧 狀況</a></li></ol></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">2.</strong> 🚧 使用火力</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">3.</strong> 🚧 戰術移動</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">4.</strong> 🚧 保護</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">5.</strong> 🚧 指揮、管制與部隊領導流程</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">6.</strong> 🚧 維持</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">7.</strong> 🚧 進攻行動</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">8.</strong> 🚧 防禦行動</a></li><li class="chapter-item expanded "><a href="work-in-progress.html"><strong aria-hidden="true">9.</strong> 🚧 巡邏</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><a href="terms.html">附錄 - 名詞對照表</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
