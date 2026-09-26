# Xiaohongshu (小红书) research brief — desktop agent

You are THE ONLY agent allowed to use the desktop. Firefox on the desktop is signed in to Xiaohongshu (xiaohongshu.com)
and Expedia (expedia.ca). Use the desktop tools (load with ToolSearch
"select:mcp__desktop__screenshot,mcp__desktop__left_click,mcp__desktop__type,mcp__desktop__key,mcp__desktop__scroll,mcp__desktop__mouse_move,mcp__desktop__list_windows,mcp__desktop__left_double_click").
Take a screenshot first. Open new tabs as needed; do not close the user's existing tabs.

Read /home/rmng/japan-trip/scripts/ideas/SCHEMA.md (travellers, dates, plan, JSON format), EXPERIENCE.md (the
"experience" field) and DEALS.md (bargain rules). Two routes are being considered:
  A) current: Tokyo/Kawasaki → Hakone/Fuji → Zao/Sendai (Tohoku) → Hakodate → Niseko/Otaru/Asahikawa/Biei → Sapporo
  B) new: Tokyo → west along the way (Hakone/Fuji, Nagoya, Takayama/Shirakawa-go/Kanazawa, Kyoto/Nara/Uji/Kobe) → Osaka → fly to Hokkaido.
Skim /home/rmng/japan-trip/src/data/ideas.json titles so you add NEW things, not repeats.

Search Xiaohongshu in Chinese for your pass topic, for example: 北海道 冬天 攻略 2026, 札幌 平价美食, 小樽 必吃,
东京 省钱攻略, 秋叶原 女仆咖啡 推荐, 川崎 少女乐队的呐喊 圣地巡礼, 大阪 冬天 攻略, 京都 雪景 攻略, 名古屋 自驾, 日本 JDM 租车,
日本 退税 2026 新规, 大阪 飞 北海道 廉航, 酒店 性价比 札幌, 滑雪 新手 二世谷. Open the notes, read the full text and the top comments.

ADS vs REAL: be strict.
- Skip notes marked 广告/赞助/合作 or with brand tags, discount codes, "私信我"/"主页有链接", group-buy links, or a shop's own account.
- Skip notes whose comments say it is an ad (广子/恰饭) or that the place was bad.
- Prefer: recent (winter 2025–26 or later), many 收藏 (saves), real photos, clear prices, and the same tip confirmed by 2+ independent notes.
- In each option, add to "winterNote": "XHS: n independent notes, latest <month year>".
Then, where it helps, check the price on Expedia (read only) or the official site.

Output: a JSON array (SCHEMA.md format + "experience"), "area": "xhs", to the output file named in your task.
Use "category": "deal" for bargains, or the normal categories for places/food/guides. For route-B-only ideas, say "Route B (Osaka)" at the start of "summary" and set "days": []. 8–15 strong options.
Read only: no booking, no posting, no commenting, no liking, no following, no messages, no personal data, no account changes.
Final reply: 4 lines.

## Pass plan (the lead restarts one desktop agent after each pass)
1. Hokkaido winter → deals-xhs-1.json
2. Tokyo & Kawasaki: anime pilgrimage (Girls Band Cry, Bocchi, Kaguya-sama), maid cafés, Akihabara/Nakano shopping, cheap eats, hotels → deals-xhs-2.json
3. Route B: Nagoya, Takayama/Shirakawa-go, Kanazawa, Kyoto/Uji/Nara, Osaka, Kobe, and Osaka→Hokkaido flights → deals-xhs-3.json
4. Hakone/Fuji, Zao/Tohoku, skiing and onsen ryokan value → deals-xhs-4.json
5. Money: tax refund 2026 rules, payment, shopping coupons, SIM, JDM car rental/tours → deals-xhs-5.json

## How to search (from the user)
Open https://www.xiaohongshu.com/search_result?keyword=<URL-encoded keywords>&source=web_search_result_notes
in the address bar (Ctrl+L), instead of using the site's search box.

## Pace and saving (learned from pass 2: the account was blocked, code 300011, after ~30 fast note opens)
- Open at most one note every 60–90 seconds, and no more than ~25 notes per pass. Scroll and read like a person.
- If a "安全限制" / verification / login page appears: STOP at once, save what you have, and report it. Do not log in.
- Write your JSON file after every 2–3 useful notes (update the same file), so nothing is lost.
