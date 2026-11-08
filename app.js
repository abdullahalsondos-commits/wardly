"use strict";
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;
const html = htm.bind(React.createElement);
let REDUCE = (() => { try { return localStorage.getItem("wardly-motion") === "off"; } catch (e) { return false; } })();
document.documentElement.classList.toggle("no-motion", REDUCE);
function setMotion(on) { REDUCE = !on; document.documentElement.classList.toggle("no-motion", !on); try { localStorage.setItem("wardly-motion", on ? "on" : "off"); } catch (e) {} emit(); }

/* ============================================================
   i18n
   ============================================================ */
const EN = {
  app_tag:"B2B Reverse Auction Platform",
  login_title:"Sign in", login_email:"Company email", login_password:"Password", login_btn:"Sign in",
  login_demo:"Demo accounts (one click)", login_or:"or sign in with email", login_new:"New company? Register for verification",
  login_err:"No active account with that email.", login_pending:"Your company is still waiting for admin verification.", login_rejected:"Your company registration was rejected.",
  feat1:"Verified suppliers only", feat2:"Blind, real-time bidding", feat3:"Soft-close stops last-second sniping", feat4:"Deposits and runner-up failover protect the buyer",
  role_BUYER:"Buyer", role_SUPPLIER:"Supplier", role_ADMIN:"Admin",
  reg_title:"Register your company", reg_name:"Company name", reg_type:"Company type", reg_tax:"Tax ID", reg_country:"Country", reg_person:"Your full name", reg_email:"Work email",
  reg_docs:"Verification documents", reg_submit:"Submit for verification", reg_done:"Registration sent. An admin will review {name}. Switch to the Admin account to verify it.", reg_back:"Back to sign in",
  reg_err_email:"This email is already registered.", reg_err_req:"Fill in every field.",
  nav_dashboard:"Dashboard", nav_my_auctions:"My Auctions", nav_create:"Create Auction", nav_suppliers:"Suppliers", nav_contracts:"Contracts",
  nav_opportunities:"Opportunities", nav_rooms:"Bidding Rooms", nav_overview:"Overview", nav_verification:"Verification", nav_live_monitor:"Live Monitor", nav_payments:"Deposits & Payments", nav_users:"Users", nav_audit:"Audit Log",
  view_as:"View as", logout:"Sign out", notifications:"Notifications", mark_all:"Mark all read", no_notifs:"Nothing new.",
  theme:"Theme", language:"العربية",
  sim_title:"Demo controls", sim_speed:"Simulation speed", sim_bots:"Simulated suppliers bid automatically", sim_motion:"Animations", sim_reset:"Reset demo data", sim_note:"This demo runs the whole back end in your browser: the bidding engine, scheduler, payment gateway and other suppliers are simulated. Nothing is saved.", sim_clock:"Sim clock",
  st_DRAFT:"Draft", st_PREQUALIFICATION:"Pre-qualification", st_SCHEDULED:"Scheduled", st_LIVE:"Live", st_SOFT_CLOSE:"Soft-close", st_CLOSED:"Closed", st_AWARDED:"Awarded", st_COMPLETED:"Completed", st_CANCELLED:"Cancelled", st_EXPIRED:"Expired",
  st_PENDING_SIGN:"Pending signature", st_SIGNED:"Signed", st_DEFAULTED:"Defaulted", st_PENDING:"Pending review", st_APPROVED:"Approved", st_REJECTED:"Rejected", st_HELD:"Held", st_RELEASED:"Released", st_FORFEITED:"Forfeited", st_VERIFIED:"Verified",
  // dashboard buyer
  b_dash_title:"Procurement dashboard", b_dash_sub:"Savings and activity for {co}",
  k_savings:"Total savings", k_avg_savings:"Average saving vs budget", k_active:"Active auctions", k_spend:"Spend awarded", k_actions:"Needs your action",
  k_completed_n:"{n} completed auctions", k_live_n:"{n} live now",
  savings_by_month:"Savings by month", savings_by_month_sub:"Budget ceiling minus final contract price, completed auctions",
  attention:"Needs attention", attention_none:"You're all caught up.",
  att_award:"Closed: review the ranking and award", att_prequal:"{n} supplier applications to review", att_sign:"Waiting for {name} to sign", att_deliver:"Signed: confirm delivery",
  live_now:"Live now", no_live:"No auctions are live right now.",
  lowest:"Lowest bid", saving_so_far:"Saving so far", bids_n:"{n} bids", ends_in:"Ends in", starts_in:"Starts in", ended:"Ended",
  // auctions list
  my_auctions:"My auctions", f_all:"All", f_active:"Active", f_closed:"Closed & awarded", f_done:"Completed", f_drafts:"Drafts & ended",
  col_id:"#", col_title:"Title", col_category:"Category", col_status:"Status", col_budget:"Budget", col_best:"Best / final", col_saving:"Saving", col_start:"Start", col_supplier:"Supplier", col_amount:"Amount", col_time:"Time", col_result:"Result",
  col_docs:"Submitted documents", col_bond:"Bid bond", col_action:"Action", col_rank:"Rank", col_final:"Final bid", col_contract:"Contract", col_order:"Award order", col_price:"Final price", col_deadline:"Sign deadline", col_buyer:"Buyer", col_ref:"Gateway ref", col_created:"Created", col_country:"Country", col_verified_since:"Verified since", col_joined:"Auctions joined", col_wins:"Wins", col_avg_disc:"Avg discount", col_defaults:"Defaults", col_name:"Name", col_email:"Email", col_role:"Role", col_company:"Company", col_active:"Active", col_actor:"Actor", col_event:"Event", col_details:"Details", col_auction:"Auction", col_type:"Type", col_tax:"Tax ID", col_label:"Anonymous label", col_participants:"Participants", col_extensions:"Extensions",
  new_auction:"New auction", open:"Open", no_rows:"Nothing here yet.",
  // detail
  back:"Back", tab_overview:"Overview", tab_prequal:"Pre-qualification", tab_live:"Live monitor", tab_result:"Result & contract",
  lifecycle:"Lifecycle",
  d_category:"Category", d_quantity:"Quantity", d_specs:"Specifications", d_delivery:"Delivery deadline", d_budget:"Budget ceiling", d_min_dec:"Minimum decrement", d_bond:"Bid bond per supplier", d_start:"Start", d_end:"End", d_softclose:"Soft-close rule", d_softclose_v:"Bid in last {w} → +{e}", d_invited:"Invited suppliers", d_buyer:"Buyer", d_created:"Created",
  publish:"Publish & invite suppliers", delete_draft:"Delete draft", start_now:"Start now (demo)", cancel_auction:"Cancel auction",
  pq_title:"Pre-qualification: {title}", pq_meta:"Starts {start} · Bid bond required: {bond}", pq_summary:"{a} approved, {p} pending, {r} rejected. The auction moves to Scheduled once at least one supplier is approved with the bond held. Suppliers never see this list.",
  approve:"Approve", reject:"Reject", view:"View", not_paid:"Not paid", no_apps:"No applications yet. Invited suppliers usually apply within a few seconds in this demo.",
  live_ranking:"Live ranking", live_ranking_sub:"Anonymous labels. Names are revealed when the auction closes.", live_ranking_admin:"Admin view: real names visible for dispute handling.",
  engine_trace:"Bidding engine trace", engine_trace_sub:"Steps from DFD Level 2, process 4.0", trace_empty:"Waiting for bids…",
  price_curve:"Lowest bid over time", extensions:"Extensions", time_remaining:"Time remaining", softclose_active:"Soft-close active: +{e} added on each new bid", not_live_yet:"The bidding room opens at the start time.",
  result_title:"Result: {title}", result_meta:"Budget ceiling {b} · Winning bid {w} · Saved {s} ({p})", result_wait:"Results appear here after the auction closes.", result_none:"This auction ended without valid bids.",
  r_winner_pending:"Winner · pending signature", r_winner_signed:"Winner · signed", r_delivered:"Delivered", r_defaulted:"Defaulted · bond forfeited", r_runner:"Runner-up · active reserve", r_not:"Not awarded", r_leading:"Rank 1", r_second:"Rank 2",
  award_to:"Send contract to #{n} ({name})", failover_btn:"Winner defaulted: fail over to #{n}", confirm_delivery:"Confirm delivery & complete", copy_report:"Copy report", report_copied:"Report copied to clipboard.", copy_failed:"Copy was blocked by the browser.",
  timeline:"Contract timeline", tl_closed:"Closed", tl_awarded:"Awarded to #{n}", tl_awaiting:"Awaiting signature ({t} left)", tl_signed:"Signed", tl_delivery:"Delivery", tl_completed:"Completed",
  failover_note:"If #{n} refuses or misses the deadline, the bond is forfeited and the next supplier is awarded immediately, without restarting the procurement cycle.",
  contract_history:"Contract history", penalty_terms:"Penalty terms",
  // create
  create_title:"Create reverse auction", create_sub:"Publishing moves the auction from Draft to Pre-qualification and invites the selected suppliers.",
  f_title:"Title", f_category:"Category", f_specs:"Specifications", f_qty:"Quantity", f_budget:"Budget ceiling (maximum)", f_delivery:"Delivery deadline", f_start_in:"Starts in (minutes)", f_duration:"Duration (minutes)", f_min_dec:"Min. decrement", f_window:"Soft-close window (sec)", f_ext:"Extension (sec)", f_bond:"Bid bond (deposit) per supplier", f_invite:"Invite suppliers", f_penalty:"Penalty terms",
  f_schedule_hint:"Room opens {start}, closes {end}", save_draft:"Save draft", use_example:"Fill example", created_draft:"Draft #{id} saved.", created_pub:"Auction #{id} published. Invitations sent.",
  e_req:"Required", e_pos:"Must be greater than 0", e_dec:"Must be less than the budget", e_invite:"Invite at least one supplier", e_window:"At least 30 seconds", e_ext:"At least 15 seconds", e_dur:"At least 2 minutes", e_start:"At least 1 minute",
  // suppliers & contracts (buyer)
  suppliers_title:"Verified suppliers", suppliers_sub:"Performance across all auctions on the platform",
  contracts_title:"Contracts", contracts_sub:"Every award, including runner-up failovers",
  // supplier
  s_dash_title:"Supplier dashboard", s_dash_sub:"{co} · bidding anonymously",
  k_winrate:"Win rate", k_rooms:"Live rooms", k_won_value:"Contracts won", k_pending:"Pending actions",
  k_winrate_sub:"{w} of {n} closed auctions",
  rooms_upcoming:"Live & upcoming rooms", invitations:"Open invitations", recent_results:"Recent results", enter_room:"Enter room", apply:"Apply to pre-qualify",
  opps_title:"Opportunities", opps_sub:"Auctions you're invited to. Apply with documents and a bid bond to get into the room.",
  opp_buyer:"Buyer", opp_qty:"Quantity", opp_budget:"Budget ceiling", opp_delivery:"Delivery by", opp_start:"Starts", opp_bond:"Bid bond",
  my_status_none:"Not applied", my_label:"You'll bid as {label}", no_opps:"No open invitations right now.",
  apply_title:"Pre-qualify for #{id}", apply_docs:"Documents", apply_docs_hint:"Attach certificates. In this demo files stay in your browser; only their names are recorded.", apply_files:"Upload files", apply_terms:"I accept the penalty terms: {terms}",
  apply_next:"Continue to bid bond", apply_pay_title:"Bid bond via payment gateway", apply_pay_sub:"{amount} is held (not charged). It's released after the auction unless you win and default.",
  card_number:"Card number", card_exp:"Expiry", card_cvc:"CVC", pay_hold:"Hold {amount}", paying:"Contacting payment gateway…", paid:"Deposit held · ref {ref}", submit_app:"Submit application", app_sent:"Application sent for #{id}.", doc_required:"Select at least one document.",
  rooms_title:"Bidding rooms", rooms_sub:"Auctions you're approved for",
  room_title:"Live Room: {title}", anon_bidder:"Anonymous bidder · {label}", connected:"Connected", offline:"Connection lost · reconnecting…", reconnecting:"Reconnecting…", syncing:"Syncing state snapshot…", synced:"Reconnected. State synced before bidding was re-enabled.",
  sim_drop:"Simulate network drop",
  current_lowest:"Current lowest bid", by_vendor:"by {label}", by_you:"by you", your_last:"Your last bid", no_bids_yet:"No bids yet. The first bid must be at or below the budget ceiling.",
  leading:"You're leading", outbid_msg:"Not the lowest. Beat {amount} to lead.", no_bid_yet:"You haven't bid yet.",
  new_bid:"Your new bid (must be ≤ {max}, min. step {dec})", place_bid:"Place bid", bid_ok:"Bid accepted: {amount}", big_jump:"This bid is {p} below the current lowest. Check the amount, then confirm.", confirm_bid:"Confirm bid",
  your_bids:"Your bids", auction_details:"Auction details", view_specs:"View full specification", blind_note:"Competitor names, locations and participant count are never shown.",
  room_closed:"Auction closed. The ranking is frozen and the buyer is reviewing results.", you_won:"You won this auction. Sign the contract from the Contracts page.", you_runner:"You're the runner-up. Your bond stays held as a reserve.", you_lost:"Another supplier won. Your bond was released.", room_wait:"The room opens in", res_outbid:"Outbid", res_leading:"Leading", res_final_win:"Won",
  s_contracts_sub:"Contracts awarded to you",
  sign:"Sign contract", decline:"Decline", sign_title:"Sign contract for #{id}", sign_accept:"I accept the contract at {price} and the penalty terms.", decline_title:"Decline award for #{id}?", decline_warn:"Declining forfeits your bid bond of {bond}. The contract goes to the runner-up.", confirm_decline:"Decline and forfeit bond", signed_ok:"Contract signed.",
  // admin
  a_dash_title:"Platform overview", a_dash_sub:"Verification, live activity and money held",
  k_verified:"Verified companies", k_pending_verif:"Awaiting verification", k_live:"Live auctions", k_held:"Bonds held", k_gmv:"Contract value (completed)",
  gmv_by_month:"Completed contract value by month", recent_audit:"Recent activity",
  verif_title:"Company verification", verif_sub:"Companies can't buy or bid until verified", verify:"Verify", registered:"Registered {t}", docs:"Documents", all_verified:"No companies waiting.", history:"History",
  live_title:"Live monitor", live_sub:"Every live auction on the platform",
  pay_title:"Deposits & payments", pay_sub:"Bid bonds held, released and forfeited through the payment gateway", total:"Total",
  users_title:"Users", users_sub:"Accounts across all companies", deactivate:"Deactivate", activate:"Activate",
  audit_title:"Audit log", audit_sub:"Every state change, newest first", search:"Search…",
  // errors
  err_not_live:"The auction isn't accepting bids.", err_not_eligible:"You're not approved for this auction.", err_invalid:"Enter a valid amount.", err_already_lowest:"You already hold the lowest bid.", err_not_lower:"Bid must be ≤ {max}.", err_over_budget:"First bid must be ≤ the budget ceiling ({max}).", err_offline:"You're offline. Wait for the connection to sync.",
  // notifications
  n_auction_live:"Auction #{id} is now live.", n_room_open:"Room #{id} is open: {title}.", n_outbid:"You were outbid on #{id}. New lowest: {amount}.", n_auction_closed:"Auction #{id} closed. Review the ranking and award the contract.", n_auction_expired:"Auction #{id} ended with no valid bids.",
  n_awarded_you:"You won auction #{id}. Sign the contract within 48 hours.", n_runner_up:"You're the runner-up on #{id}. Your bond stays held as reserve.", n_not_awarded:"Auction #{id} went to another supplier. Your bond was released.",
  n_contract_signed:"{name} signed the contract for #{id}.", n_contract_defaulted:"The winner of #{id} defaulted. Bond forfeited.", n_failover_you:"Auction #{id} was awarded to you after the winner defaulted. Sign within 48 hours.", n_failover_buyer:"#{id} failed over to {name} at {amount}.", n_cancelled:"Auction #{id} was cancelled.",
  n_invited:"You're invited to auction #{id}: {title}.", n_prequal_new:"{name} applied to pre-qualify for #{id}.", n_prequal_approved:"You're approved for #{id}. You'll bid as {label}.", n_prequal_rejected:"Your application for #{id} was rejected. Bond refunded.", n_scheduled:"Auction #{id} is scheduled. The room opens at start time.",
  n_company_pending:"{name} registered and is waiting for verification.", n_delivered:"Auction #{id} completed. Deposits released.", n_softclose:"Soft-close on #{id}: a late bid extended the timer.",
  ago:"ago", now:"now", all_auctions:"All auctions", col_bids:"Bids",
};
const AR = {
  app_tag:"منصة مزادات عكسية بين الشركات",
  login_title:"تسجيل الدخول", login_email:"إيميل الشركة", login_password:"كلمة السر", login_btn:"دخول",
  login_demo:"حسابات تجريبية (بضغطة واحدة)", login_or:"أو ادخل بالإيميل", login_new:"شركة جديدة؟ سجّل للتوثيق",
  login_err:"مفيش حساب نشط بالإيميل ده.", login_pending:"شركتك لسه مستنية توثيق الأدمن.", login_rejected:"طلب تسجيل شركتك اترفض.",
  feat1:"موردين موثّقين بس", feat2:"مزايدة عمياء ولحظية", feat3:"الـ Soft-close بيمنع المزايدة في آخر ثانية", feat4:"التأمين والمورد الاحتياطي بيحموا المشتري",
  role_BUYER:"مشتري", role_SUPPLIER:"مورد", role_ADMIN:"أدمن",
  reg_title:"سجّل شركتك", reg_name:"اسم الشركة", reg_type:"نوع الشركة", reg_tax:"الرقم الضريبي", reg_country:"الدولة", reg_person:"اسمك بالكامل", reg_email:"إيميل الشغل",
  reg_docs:"مستندات التوثيق", reg_submit:"ابعت للتوثيق", reg_done:"الطلب اتبعت. الأدمن هيراجع {name}. ادخل بحساب الأدمن عشان توثقها.", reg_back:"رجوع لتسجيل الدخول",
  reg_err_email:"الإيميل ده متسجل قبل كده.", reg_err_req:"املا كل الخانات.",
  nav_dashboard:"الرئيسية", nav_my_auctions:"مزاداتي", nav_create:"مزاد جديد", nav_suppliers:"الموردين", nav_contracts:"العقود",
  nav_opportunities:"الفرص", nav_rooms:"غرف المزايدة", nav_overview:"نظرة عامة", nav_verification:"التوثيق", nav_live_monitor:"المتابعة اللايف", nav_payments:"التأمينات والمدفوعات", nav_users:"المستخدمين", nav_audit:"سجل العمليات",
  view_as:"اعرض كـ", logout:"خروج", notifications:"الإشعارات", mark_all:"علّم الكل كمقروء", no_notifs:"مفيش جديد.",
  theme:"الثيم", language:"English",
  sim_title:"أدوات الديمو", sim_speed:"سرعة المحاكاة", sim_bots:"موردين وهميين بيزايدوا أوتوماتيك", sim_motion:"الأنيميشن", sim_reset:"رجّع البيانات من الأول", sim_note:"الديمو ده بيشغّل الـ back end كله جوه المتصفح: محرك المزايدة والـ scheduler وبوابة الدفع والموردين التانيين كلهم متمثّلين. مفيش حاجة بتتحفظ.", sim_clock:"ساعة المحاكاة",
  st_DRAFT:"مسودة", st_PREQUALIFICATION:"تأهيل مسبق", st_SCHEDULED:"مجدول", st_LIVE:"لايف", st_SOFT_CLOSE:"إغلاق مرن", st_CLOSED:"مقفول", st_AWARDED:"تمت الترسية", st_COMPLETED:"مكتمل", st_CANCELLED:"ملغي", st_EXPIRED:"منتهي",
  st_PENDING_SIGN:"مستني التوقيع", st_SIGNED:"متوقّع", st_DEFAULTED:"متعثّر", st_PENDING:"قيد المراجعة", st_APPROVED:"مقبول", st_REJECTED:"مرفوض", st_HELD:"محجوز", st_RELEASED:"اتفك", st_FORFEITED:"اتصادر", st_VERIFIED:"موثّق",
  b_dash_title:"لوحة المشتريات", b_dash_sub:"التوفير والنشاط لـ {co}",
  k_savings:"إجمالي التوفير", k_avg_savings:"متوسط التوفير من الميزانية", k_active:"مزادات شغالة", k_spend:"قيمة العقود", k_actions:"محتاج منك إجراء",
  k_completed_n:"{n} مزاد مكتمل", k_live_n:"{n} لايف دلوقتي",
  savings_by_month:"التوفير بالشهر", savings_by_month_sub:"الميزانية القصوى ناقص سعر العقد النهائي، للمزادات المكتملة",
  attention:"محتاج انتباهك", attention_none:"كله تمام، مفيش حاجة متأخرة.",
  att_award:"اتقفل: راجع الترتيب ورسّي العقد", att_prequal:"{n} طلب تأهيل محتاجين مراجعة", att_sign:"مستنيين {name} يوقّع", att_deliver:"اتوقّع: أكّد الاستلام",
  live_now:"لايف دلوقتي", no_live:"مفيش مزادات لايف دلوقتي.",
  lowest:"أقل سعر", saving_so_far:"التوفير لحد دلوقتي", bids_n:"{n} مزايدة", ends_in:"بيخلص بعد", starts_in:"بيبدأ بعد", ended:"خلص",
  my_auctions:"مزاداتي", f_all:"الكل", f_active:"شغالة", f_closed:"مقفولة ومترسية", f_done:"مكتملة", f_drafts:"مسودات ومنتهية",
  col_id:"#", col_title:"العنوان", col_category:"الفئة", col_status:"الحالة", col_budget:"الميزانية", col_best:"أفضل/نهائي", col_saving:"التوفير", col_start:"البداية", col_supplier:"المورد", col_amount:"المبلغ", col_time:"الوقت", col_result:"النتيجة",
  col_docs:"المستندات", col_bond:"التأمين", col_action:"إجراء", col_rank:"الترتيب", col_final:"آخر سعر", col_contract:"العقد", col_order:"ترتيب الترسية", col_price:"السعر النهائي", col_deadline:"آخر ميعاد للتوقيع", col_buyer:"المشتري", col_ref:"مرجع البوابة", col_created:"اتعمل", col_country:"الدولة", col_verified_since:"موثّق من", col_joined:"مزادات شارك فيها", col_wins:"كسب", col_avg_disc:"متوسط الخصم", col_defaults:"تعثّرات", col_name:"الاسم", col_email:"الإيميل", col_role:"الدور", col_company:"الشركة", col_active:"نشط", col_actor:"المنفّذ", col_event:"الحدث", col_details:"التفاصيل", col_auction:"المزاد", col_type:"النوع", col_tax:"الرقم الضريبي", col_label:"الاسم المجهول", col_participants:"المشاركين", col_extensions:"التمديدات",
  new_auction:"مزاد جديد", open:"افتح", no_rows:"مفيش حاجة هنا لسه.",
  back:"رجوع", tab_overview:"التفاصيل", tab_prequal:"التأهيل المسبق", tab_live:"المتابعة اللايف", tab_result:"النتيجة والعقد",
  lifecycle:"دورة حياة المزاد",
  d_category:"الفئة", d_quantity:"الكمية", d_specs:"المواصفات", d_delivery:"آخر ميعاد للتسليم", d_budget:"الميزانية القصوى", d_min_dec:"أقل تخفيض", d_bond:"التأمين لكل مورد", d_start:"البداية", d_end:"النهاية", d_softclose:"قاعدة الإغلاق المرن", d_softclose_v:"مزايدة في آخر {w} ← +{e}", d_invited:"الموردين المدعوين", d_buyer:"المشتري", d_created:"اتعمل",
  publish:"انشر وادعُ الموردين", delete_draft:"امسح المسودة", start_now:"ابدأ دلوقتي (ديمو)", cancel_auction:"الغِ المزاد",
  pq_title:"التأهيل المسبق: {title}", pq_meta:"بيبدأ {start} · التأمين المطلوب: {bond}", pq_summary:"{a} مقبول، {p} قيد المراجعة، {r} مرفوض. المزاد بيتحوّل لـ «مجدول» أول ما مورد واحد على الأقل يتقبل وتأمينه محجوز. الموردين مش بيشوفوا القايمة دي.",
  approve:"اقبل", reject:"ارفض", view:"عرض", not_paid:"مدفعش", no_apps:"مفيش طلبات لسه. في الديمو الموردين المدعوين بيقدّموا خلال ثواني.",
  live_ranking:"الترتيب اللايف", live_ranking_sub:"أسماء مجهولة. الأسامي الحقيقية بتظهر لما المزاد يقفل.", live_ranking_admin:"عرض الأدمن: الأسامي الحقيقية ظاهرة عشان حل النزاعات.",
  engine_trace:"تتبّع محرك المزايدة", engine_trace_sub:"الخطوات من DFD المستوى 2، العملية 4.0", trace_empty:"مستني مزايدات…",
  price_curve:"أقل سعر على مدار الوقت", extensions:"التمديدات", time_remaining:"الوقت الباقي", softclose_active:"الإغلاق المرن شغال: +{e} مع كل مزايدة جديدة", not_live_yet:"غرفة المزايدة بتفتح في ميعاد البداية.",
  result_title:"النتيجة: {title}", result_meta:"الميزانية {b} · السعر الفايز {w} · وفّرت {s} ({p})", result_wait:"النتيجة هتظهر هنا بعد ما المزاد يقفل.", result_none:"المزاد خلص من غير مزايدات صالحة.",
  r_winner_pending:"الفايز · مستني التوقيع", r_winner_signed:"الفايز · وقّع", r_delivered:"اتسلّم", r_defaulted:"اتعثّر · التأمين اتصادر", r_runner:"الاحتياطي · جاهز", r_not:"مرسيش عليه", r_leading:"المركز 1", r_second:"المركز 2",
  award_to:"ابعت العقد لـ #{n} ({name})", failover_btn:"الفايز اتعثّر: حوّل لـ #{n}", confirm_delivery:"أكّد الاستلام وكمّل", copy_report:"انسخ التقرير", report_copied:"التقرير اتنسخ.", copy_failed:"المتصفح منع النسخ.",
  timeline:"مراحل العقد", tl_closed:"اتقفل", tl_awarded:"اترسى على #{n}", tl_awaiting:"مستني التوقيع (باقي {t})", tl_signed:"اتوقّع", tl_delivery:"التسليم", tl_completed:"اكتمل",
  failover_note:"لو #{n} رفض أو فاته الميعاد، التأمين بيتصادر والعقد بيروح للي بعده على طول، من غير ما نعيد المناقصة من الأول.",
  contract_history:"تاريخ العقود", penalty_terms:"شروط الغرامة",
  create_title:"اعمل مزاد عكسي", create_sub:"النشر بينقل المزاد من «مسودة» لـ «تأهيل مسبق» وبيبعت دعوات للموردين اللي اخترتهم.",
  f_title:"العنوان", f_category:"الفئة", f_specs:"المواصفات", f_qty:"الكمية", f_budget:"الميزانية القصوى", f_delivery:"آخر ميعاد للتسليم", f_start_in:"يبدأ بعد (دقايق)", f_duration:"المدة (دقايق)", f_min_dec:"أقل تخفيض", f_window:"نافذة الإغلاق المرن (ثانية)", f_ext:"التمديد (ثانية)", f_bond:"التأمين لكل مورد", f_invite:"ادعُ موردين", f_penalty:"شروط الغرامة",
  f_schedule_hint:"الغرفة بتفتح {start} وبتقفل {end}", save_draft:"احفظ مسودة", use_example:"املا مثال", created_draft:"المسودة #{id} اتحفظت.", created_pub:"المزاد #{id} اتنشر والدعوات اتبعتت.",
  e_req:"مطلوب", e_pos:"لازم يكون أكبر من صفر", e_dec:"لازم يكون أقل من الميزانية", e_invite:"ادعُ مورد واحد على الأقل", e_window:"30 ثانية على الأقل", e_ext:"15 ثانية على الأقل", e_dur:"دقيقتين على الأقل", e_start:"دقيقة على الأقل",
  suppliers_title:"الموردين الموثّقين", suppliers_sub:"أداءهم في كل مزادات المنصة",
  contracts_title:"العقود", contracts_sub:"كل الترسيات، ومعاها التحويل للمورد الاحتياطي",
  s_dash_title:"لوحة المورد", s_dash_sub:"{co} · بتزايد باسم مجهول",
  k_winrate:"نسبة الفوز", k_rooms:"غرف لايف", k_won_value:"عقود كسبتها", k_pending:"إجراءات مستنياك",
  k_winrate_sub:"{w} من {n} مزاد مقفول",
  rooms_upcoming:"غرف لايف وجاية", invitations:"دعوات مفتوحة", recent_results:"آخر النتايج", enter_room:"ادخل الغرفة", apply:"قدّم للتأهيل",
  opps_title:"الفرص", opps_sub:"المزادات اللي اتدعيت لها. قدّم مستنداتك والتأمين عشان تدخل الغرفة.",
  opp_buyer:"المشتري", opp_qty:"الكمية", opp_budget:"الميزانية القصوى", opp_delivery:"التسليم قبل", opp_start:"بيبدأ", opp_bond:"التأمين",
  my_status_none:"مقدّمتش", my_label:"هتزايد باسم {label}", no_opps:"مفيش دعوات مفتوحة دلوقتي.",
  apply_title:"التأهيل لمزاد #{id}", apply_docs:"المستندات", apply_docs_hint:"ارفع الشهادات. في الديمو الملفات بتفضل في متصفحك وبنسجل أساميها بس.", apply_files:"ارفع ملفات", apply_terms:"موافق على شروط الغرامة: {terms}",
  apply_next:"كمّل للتأمين", apply_pay_title:"التأمين عن طريق بوابة الدفع", apply_pay_sub:"مبلغ {amount} بيتحجز (مش بيتخصم). بيتفك بعد المزاد إلا لو كسبت واتعثّرت.",
  card_number:"رقم الكارت", card_exp:"تاريخ الانتهاء", card_cvc:"CVC", pay_hold:"احجز {amount}", paying:"بنكلم بوابة الدفع…", paid:"التأمين اتحجز · مرجع {ref}", submit_app:"ابعت الطلب", app_sent:"طلبك لمزاد #{id} اتبعت.", doc_required:"اختار مستند واحد على الأقل.",
  rooms_title:"غرف المزايدة", rooms_sub:"المزادات اللي اتقبلت فيها",
  room_title:"غرفة لايف: {title}", anon_bidder:"مزايد مجهول · {label}", connected:"متصل", offline:"النت فصل · بنحاول نوصل…", reconnecting:"بنعيد الاتصال…", syncing:"بنزامن آخر حالة…", synced:"رجعنا. الحالة اتزامنت قبل ما المزايدة تتفتح تاني.",
  sim_drop:"جرّب فصل النت",
  current_lowest:"أقل سعر حالي", by_vendor:"من {label}", by_you:"منك", your_last:"آخر سعر ليك", no_bids_yet:"مفيش مزايدات لسه. أول مزايدة لازم تكون أقل من أو تساوي الميزانية.",
  leading:"إنت الأقل دلوقتي", outbid_msg:"مش الأقل. اكسر {amount} عشان تتصدّر.", no_bid_yet:"لسه مزايدتش.",
  new_bid:"سعرك الجديد (لازم ≤ {max}، أقل خطوة {dec})", place_bid:"زايد", bid_ok:"المزايدة اتقبلت: {amount}", big_jump:"السعر ده أقل من أقل سعر حالي بـ {p}. راجع المبلغ وبعدين أكّد.", confirm_bid:"أكّد المزايدة",
  your_bids:"مزايداتك", auction_details:"تفاصيل المزاد", view_specs:"شوف المواصفات كاملة", blind_note:"أسامي المنافسين وأماكنهم وعددهم مش بتظهر أبدًا.",
  room_closed:"المزاد اتقفل. الترتيب اتثبّت والمشتري بيراجع النتيجة.", you_won:"كسبت المزاد ده. وقّع العقد من صفحة العقود.", you_runner:"إنت الاحتياطي. تأمينك هيفضل محجوز.", you_lost:"مورد تاني كسب. تأمينك اتفك.", room_wait:"الغرفة بتفتح بعد", res_outbid:"اتكسر", res_leading:"متصدّر", res_final_win:"كسب",
  s_contracts_sub:"العقود اللي اترست عليك",
  sign:"وقّع العقد", decline:"ارفض", sign_title:"توقيع عقد #{id}", sign_accept:"موافق على العقد بسعر {price} وعلى شروط الغرامة.", decline_title:"ترفض الترسية في #{id}؟", decline_warn:"الرفض هيصادر تأمينك ({bond}) والعقد هيروح للمورد الاحتياطي.", confirm_decline:"ارفض وصادر التأمين", signed_ok:"العقد اتوقّع.",
  a_dash_title:"نظرة عامة على المنصة", a_dash_sub:"التوثيق والنشاط اللايف والفلوس المحجوزة",
  k_verified:"شركات موثّقة", k_pending_verif:"مستنية توثيق", k_live:"مزادات لايف", k_held:"تأمينات محجوزة", k_gmv:"قيمة العقود المكتملة",
  gmv_by_month:"قيمة العقود المكتملة بالشهر", recent_audit:"آخر نشاط",
  verif_title:"توثيق الشركات", verif_sub:"الشركة مش هتقدر تشتري أو تزايد قبل التوثيق", verify:"وثّق", registered:"اتسجلت {t}", docs:"المستندات", all_verified:"مفيش شركات مستنية.", history:"السجل",
  live_title:"المتابعة اللايف", live_sub:"كل المزادات اللايف على المنصة",
  pay_title:"التأمينات والمدفوعات", pay_sub:"التأمينات المحجوزة واللي اتفكت واللي اتصادرت عن طريق بوابة الدفع", total:"الإجمالي",
  users_title:"المستخدمين", users_sub:"الحسابات في كل الشركات", deactivate:"وقّف", activate:"فعّل",
  audit_title:"سجل العمليات", audit_sub:"كل تغيير في الحالة، الأحدث الأول", search:"دوّر…",
  err_not_live:"المزاد مش بيقبل مزايدات دلوقتي.", err_not_eligible:"إنت مش مقبول في المزاد ده.", err_invalid:"اكتب مبلغ صحيح.", err_already_lowest:"إنت أصلًا صاحب أقل سعر.", err_not_lower:"لازم السعر يكون ≤ {max}.", err_over_budget:"أول مزايدة لازم تكون ≤ الميزانية ({max}).", err_offline:"إنت أوفلاين. استنى لحد ما الاتصال يتزامن.",
  n_auction_live:"المزاد #{id} بقى لايف.", n_room_open:"الغرفة #{id} فتحت: {title}.", n_outbid:"حد كسر سعرك في #{id}. أقل سعر دلوقتي: {amount}.", n_auction_closed:"المزاد #{id} اتقفل. راجع الترتيب ورسّي العقد.", n_auction_expired:"المزاد #{id} خلص من غير مزايدات صالحة.",
  n_awarded_you:"كسبت المزاد #{id}. وقّع العقد خلال 48 ساعة.", n_runner_up:"إنت الاحتياطي في #{id}. تأمينك هيفضل محجوز.", n_not_awarded:"المزاد #{id} راح لمورد تاني. تأمينك اتفك.",
  n_contract_signed:"{name} وقّع عقد #{id}.", n_contract_defaulted:"الفايز في #{id} اتعثّر. التأمين اتصادر.", n_failover_you:"المزاد #{id} اترسى عليك بعد تعثّر الفايز. وقّع خلال 48 ساعة.", n_failover_buyer:"#{id} اتحوّل لـ {name} بسعر {amount}.", n_cancelled:"المزاد #{id} اتلغى.",
  n_invited:"اتدعيت لمزاد #{id}: {title}.", n_prequal_new:"{name} قدّم للتأهيل في #{id}.", n_prequal_approved:"اتقبلت في #{id}. هتزايد باسم {label}.", n_prequal_rejected:"طلبك في #{id} اترفض. التأمين رجع.", n_scheduled:"المزاد #{id} اتجدول. الغرفة هتفتح في ميعاد البداية.",
  n_company_pending:"{name} اتسجلت ومستنية توثيق.", n_delivered:"المزاد #{id} اكتمل. التأمينات اتفكت.", n_softclose:"إغلاق مرن في #{id}: مزايدة متأخرة مدّت الوقت.",
  ago:"من", now:"دلوقتي", all_auctions:"كل المزادات", col_bids:"المزايدات",
};
function makeT(lang){
  return (k, p) => {
    let s = (lang === "ar" ? AR[k] : undefined) ?? EN[k] ?? k;
    if (p) for (const x in p) s = s.split("{" + x + "}").join(p[x]);
    return s;
  };
}

/* ============================================================
   Simulated clock
   ============================================================ */
const SEC = 1000, MIN = 60 * SEC, HOUR = 60 * MIN, DAY = 24 * HOUR;
const clock = {
  base: Date.now(), realBase: Date.now(), speed: 1,
  now() { return this.base + (Date.now() - this.realBase) * this.speed; },
  setSpeed(s) { const n = this.now(); this.base = n; this.realBase = Date.now(); this.speed = s; },
};

/* ============================================================
   Formatting helpers
   ============================================================ */
const money = (n, compact) => {
  if (n == null || isNaN(n)) return "—";
  if (compact && Math.abs(n) >= 1000) { const k = n / 1000; return "$" + (Math.abs(k) >= 100 ? Math.round(k) : k.toFixed(Math.abs(k) >= 10 ? 0 : 1).replace(/\.0$/, "")) + "k"; }
  return "$" + Math.round(n).toLocaleString("en-US");
};
const pct = (x, d = 1) => (x * 100).toFixed(d) + "%";
const loc = (lang) => (lang === "ar" ? "ar-EG" : "en-GB");
const fDate = (ts, lang) => new Intl.DateTimeFormat(loc(lang), { day: "2-digit", month: "short", year: "numeric" }).format(ts);
const fDT = (ts, lang) => new Intl.DateTimeFormat(loc(lang), { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(ts);
const fTime = (ts) => { const d = new Date(ts); return [d.getHours(), d.getMinutes(), d.getSeconds()].map((x) => String(x).padStart(2, "0")).join(":"); };
const fTimeMs = (ts) => fTime(ts) + "." + String(new Date(ts).getMilliseconds()).padStart(3, "0");
const dur = (ms) => {
  ms = Math.max(0, ms); const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const p = (v) => String(v).padStart(2, "0");
  return h > 0 ? `${p(h)}:${p(m)}:${p(x)}` : `${p(m)}:${p(x)}`;
};
const durWords = (ms) => { const h = Math.floor(ms / HOUR), m = Math.floor((ms % HOUR) / MIN); return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`; };
function rel(ts, lang) {
  const diff = ts - clock.now(); const a = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(lang === "ar" ? "ar-EG" : "en", { numeric: "auto" });
  if (a < 45 * SEC) return rtf.format(Math.round(diff / SEC), "second");
  if (a < 45 * MIN) return rtf.format(Math.round(diff / MIN), "minute");
  if (a < 22 * HOUR) return rtf.format(Math.round(diff / HOUR), "hour");
  if (a < 26 * DAY) return rtf.format(Math.round(diff / DAY), "day");
  return rtf.format(Math.round(diff / (30 * DAY)), "month");
}
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const floorTo = (x, step) => Math.floor(x / step) * step;
const gwRef = (p = "HLD") => "GW-" + p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
const initials = (n) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

/* ============================================================
   In-memory database (mirrors reverse_auction_schema.sql)
   ============================================================ */
let db, seq;
const listeners = new Set();
const emit = () => listeners.forEach((f) => f());
const nid = (k) => (seq[k] = (seq[k] || 0) + 1);

const co = (id) => db.companies.find((c) => c.id === id);
const usr = (id) => db.users.find((u) => u.id === id);
const cat = (id) => db.categories.find((c) => c.id === id);
const auc = (id) => db.auctions.find((a) => a.id === id);
const usersOf = (cid) => db.users.filter((u) => u.company_id === cid).map((u) => u.id);
const admins = () => db.users.filter((u) => u.role === "ADMIN").map((u) => u.id);
const bidsOf = (aid) => db.bids.filter((b) => b.auction_id === aid);
const prequalsOf = (aid) => db.prequals.filter((p) => p.auction_id === aid);
const prequalOf = (aid, cid) => db.prequals.find((p) => p.auction_id === aid && p.supplier_company_id === cid);
const depositOf = (aid, cid) => db.deposits.find((d) => d.auction_id === aid && d.supplier_company_id === cid);
const contractsOf = (aid) => db.contracts.filter((c) => c.auction_id === aid).sort((x, y) => x.award_order - y.award_order);
const activeContract = (aid) => { const cs = contractsOf(aid); return cs[cs.length - 1]; };
const approvedOf = (aid) => prequalsOf(aid).filter((p) => p.status === "APPROVED").map((p) => p.supplier_company_id);
const isLive = (a) => a.status === "LIVE" || a.status === "SOFT_CLOSE";
function ranking(aid) {
  const best = {};
  for (const b of bidsOf(aid)) {
    const c = best[b.supplier_company_id];
    if (!c || b.amount < c.amount || (b.amount === c.amount && b.placed_at < c.placed_at)) best[b.supplier_company_id] = b;
  }
  return Object.values(best).sort((x, y) => x.amount - y.amount || x.placed_at - y.placed_at);
}
const lowestBid = (aid) => ranking(aid)[0] || null;
function finalPrice(a) { const c = contractsOf(a.id).find((c) => c.status !== "DEFAULTED"); return c ? c.final_price : (lowestBid(a.id)?.amount ?? null); }

function audit(actor, action, details, aid) { db.audit.unshift({ id: nid("audit"), at: clock.now(), actor, action, details, auction_id: aid ?? null }); if (db.audit.length > 400) db.audit.pop(); }
function notify(uids, type, params, aid) { for (const u of uids) db.notifications.push({ id: nid("notif"), user_id: u, type, params: params || {}, auction_id: aid ?? null, is_read: false, created_at: clock.now() }); }
function trace(aid, step, msg) { const arr = (db.trace[aid] = db.trace[aid] || []); arr.unshift({ at: clock.now(), step, msg, k: nid("trace") }); if (arr.length > 60) arr.pop(); }
function assignLabel(a, cid) {
  if (a.anon[cid]) return a.anon[cid];
  const used = new Set(Object.values(a.anon));
  let n; do { n = 1 + Math.floor(Math.random() * 12); } while (used.has("Vendor #" + n));
  return (a.anon[cid] = "Vendor #" + n);
}
const DEFAULT_PENALTY = "Failure to sign within 48h or to deliver by the deadline forfeits the bid bond. Late delivery: 0.5% of contract value per day, capped at 10%.";

function seed() {
  clock.base = Date.now(); clock.realBase = Date.now(); clock.speed = 1;
  const T = clock.now();
  seq = {};
  db = { companies: [], users: [], categories: [], auctions: [], prequals: [], deposits: [], bids: [], contracts: [], notifications: [], audit: [], trace: {}, bots: {}, settings: { bots: true } };
  const C = (id, name, type, tax, country, vs, ageDays, docs, bot) => db.companies.push({ id, name, company_type: type, tax_id: tax, country, verification_status: vs, created_at: T - ageDays * DAY, docs: docs || [], bot: !!bot });
  C(1, "Acme Corp", "BUYER", "EG-301-552-118", "Egypt", "VERIFIED", 420, ["Commercial register", "Tax card"]);
  C(2, "Pharos Pharma", "BUYER", "EG-288-410-902", "Egypt", "VERIFIED", 230, ["Commercial register", "Tax card"]);
  C(3, "Nile Tech Supplies", "SUPPLIER", "EG-412-007-331", "Egypt", "VERIFIED", 390, ["ISO 9001", "Commercial register", "Tax card"]);
  C(4, "Giza Electronics", "SUPPLIER", "EG-377-219-045", "Egypt", "VERIFIED", 350, ["ISO 9001", "Commercial register"], true);
  C(5, "Delta Computers", "SUPPLIER", "EG-366-120-778", "Egypt", "VERIFIED", 300, ["Commercial register", "Tax card"], true);
  C(6, "QuickParts Trading", "SUPPLIER", "EG-455-903-210", "Egypt", "VERIFIED", 120, ["Commercial register"], true);
  C(7, "Cairo Office Hub", "SUPPLIER", "EG-398-662-517", "Egypt", "VERIFIED", 260, ["ISO 9001", "BIFMA certificate", "Tax card"], true);
  C(8, "Alexandria Industrial", "SUPPLIER", "EG-509-114-620", "Egypt", "PENDING", 1.2, ["Commercial register", "ISO 14001", "Tax card"], true);
  C(9, "Sinai Medical Supplies", "SUPPLIER", "EG-511-870-093", "Egypt", "PENDING", 0.15, ["Commercial register", "MoH license"], true);
  C(10, "FastDeal General Trading", "SUPPLIER", "AE-77-10224", "UAE", "REJECTED", 34, ["Trade licence (expired)"], true);
  const U = (id, company_id, full_name, email, role) => db.users.push({ id, company_id, full_name, email, role, is_active: true });
  U(1, 1, "Sara Hassan", "procurement@acme-corp.com", "BUYER");
  U(2, 3, "Omar Nabil", "sales@niletech.com", "SUPPLIER");
  U(3, null, "Mona Adel", "admin@wardly.app", "ADMIN");
  U(4, 4, "Karim Fouad", "bids@gizaelec.com", "SUPPLIER");
  U(5, 5, "Hany Samir", "tenders@deltacomp.com", "SUPPLIER");
  U(6, 6, "Tarek Ali", "sales@quickparts.com", "SUPPLIER");
  U(7, 7, "Nour Emad", "b2b@cairoofficehub.com", "SUPPLIER");
  U(8, 2, "Youssef Gamal", "purchasing@pharospharma.com", "BUYER");
  U(9, 8, "Ahmed Zaki", "info@alexindustrial.com", "SUPPLIER");
  U(10, 9, "Laila Mostafa", "sales@sinaimed.com", "SUPPLIER");
  U(11, 1, "Khaled Ibrahim", "k.ibrahim@acme-corp.com", "BUYER");
  seq.user = 11; seq.company = 10;
  ["IT Equipment", "Office Furniture", "Printing Supplies", "Networking", "Industrial Equipment", "Medical Supplies"].forEach((name, i) => db.categories.push({ category_id: i + 1, id: i + 1, name }));

  const A = (o) => { const a = Object.assign({ buyer_company_id: 1, created_by: 1, quantity: 1, specifications: "", min_decrement: 50, bid_bond_amount: 0, soft_close_window_sec: 180, extension_sec: 120, current_lowest_bid: null, invited: [], anon: {}, extensions: 0, penalty_terms: DEFAULT_PENALTY, created_at: T - 3 * DAY }, o); db.auctions.push(a); return a; };
  const P = (aid, cid, status, docs, at, label) => { db.prequals.push({ prequal_id: 0, id: nid("prequal"), auction_id: aid, supplier_company_id: cid, documents: docs, status, reviewed_by: status === "PENDING" ? null : 1, submitted_at: at, reviewed_at: status === "PENDING" ? null : at + 20 * MIN }); if (label) auc(aid).anon[cid] = label; };
  const D = (aid, cid, amount, status, at) => db.deposits.push({ id: nid("deposit"), auction_id: aid, supplier_company_id: cid, amount, status, gateway_ref: gwRef(), created_at: at });
  const B = (aid, cid, amount, at) => { const a = auc(aid); db.bids.push({ id: nid("bid"), auction_id: aid, supplier_company_id: cid, placed_by: usersOf(cid)[0], amount, anon_label: a.anon[cid] || "Vendor", placed_at: at, is_accepted: true }); a.current_lowest_bid = Math.min(a.current_lowest_bid ?? Infinity, amount); };
  const K = (aid, cid, order, price, status, at, extra) => { const b = bidsOf(aid).filter((b) => b.supplier_company_id === cid).sort((x, y) => x.amount - y.amount)[0]; db.contracts.push(Object.assign({ id: nid("contract"), auction_id: aid, bid_id: b ? b.id : null, winner_company_id: cid, award_order: order, final_price: price, penalty_terms: DEFAULT_PENALTY, status, awarded_at: at, sign_deadline: at + 48 * HOUR, signed_at: null, completed_at: null }, extra || {})); };

  // ---- completed history (gives the dashboards real numbers)
  const hist = [
    ["24 office desktops - Core i5", 1, 24, 21600, 19850, 4, 5.4, 1],
    ["Laser printers x 15", 3, 15, 9000, 7980, 7, 5.1, 1],
    ["Core switches 24-port x 6", 4, 6, 14400, 12700, 4, 4.3, 1],
    ["Meeting room chairs x 60", 2, 60, 7200, 6150, 7, 4.0, 1],
    ["UPS units 3kVA x 10", 5, 10, 11500, 10350, 5, 3.2, 1],
    ["Developer laptops x 30", 1, 30, 42000, 37100, 3, 3.0, 1],
    ["A4 paper, 800 boxes", 3, 800, 6400, 5520, 6, 2.2, 1],
    ["Wi-Fi 6 access points x 40", 4, 40, 16000, 13900, 3, 2.0, 1],
    ["Lab refrigerators x 4", 6, 4, 18000, 15900, 7, 1.8, 2],
    ["Standing desks x 35", 2, 35, 17500, 15600, 7, 1.2, 1],
    ["27-inch monitors x 80", 1, 80, 24000, 20750, 4, 0.9, 1],
    ["Thermal label printers x 12", 3, 12, 4800, 4260, 5, 0.45, 1],
    ["Nitrile gloves, 2,000 boxes", 6, 2000, 9000, 7650, 6, 0.3, 2],
  ];
  hist.forEach(([title, catId, qty, budget, final, winner, monthsAgo, buyer], i) => {
    const id = i + 1;
    const start = T - monthsAgo * 30 * DAY - 12 * DAY;
    const others = [3, 4, 5, 6, 7].filter((x) => x !== winner).sort(() => Math.random() - 0.5).slice(0, 2);
    const parts = [winner, ...others];
    const a = A({ id, buyer_company_id: buyer, created_by: buyer === 1 ? 1 : 8, category_id: catId, title, quantity: qty, specifications: title + ". Standard warranty, delivery to buyer's warehouse.", budget_ceiling: budget, min_decrement: budget > 10000 ? 50 : 25, bid_bond_amount: Math.round(budget * 0.05 / 100) * 100, start_time: start, end_time: start + 60 * MIN, delivery_deadline: start + 20 * DAY, status: "COMPLETED", invited: parts, created_at: start - 3 * DAY });
    parts.forEach((cid, j) => { P(id, cid, "APPROVED", ["ISO 9001", "Datasheet"], start - 2 * DAY, "Vendor #" + (j * 3 + 2)); D(id, cid, a.bid_bond_amount, "RELEASED", start - 2 * DAY); });
    // descending bid ladder ending at final by winner
    let price = budget - a.min_decrement * 4; let t = start + 2 * MIN; const order = [others[0], others[1], winner];
    const steps = 6 + (i % 4);
    for (let s = 0; s < steps; s++) { const cid = order[s % 3]; const target = s === steps - 1 ? final : Math.max(final + a.min_decrement * (steps - s), floorTo(price, a.min_decrement)); B(id, s === steps - 1 ? winner : cid, target, t); price = target - (budget - final) / steps; t += rand(2, 6) * MIN; }
    const r = ranking(id); const fin = r[0].amount;
    K(id, r[0].supplier_company_id, 1, fin, "COMPLETED", start + 70 * MIN, { signed_at: start + 20 * HOUR, completed_at: start + 10 * DAY });
  });
  // ---- #14 closed, awaiting award
  A({ id: 14, category_id: 1, title: "500 wireless keyboard & mouse sets", quantity: 500, specifications: "Wireless keyboard + mouse combo, Arabic/English layout, 2.4 GHz receiver, 2-year warranty.", budget_ceiling: 15000, bid_bond_amount: 750, start_time: T - 80 * MIN, end_time: T - 22 * MIN, delivery_deadline: T + 25 * DAY, status: "CLOSED", invited: [3, 4, 5], created_at: T - 2 * DAY });
  P(14, 3, "APPROVED", ["ISO 9001", "Datasheet"], T - DAY, "Vendor #4"); P(14, 4, "APPROVED", ["ISO 9001"], T - DAY, "Vendor #9"); P(14, 5, "APPROVED", ["Datasheet"], T - DAY, "Vendor #1");
  [3, 4, 5].forEach((c) => D(14, c, 750, "HELD", T - DAY));
  [[3, 14600], [4, 14200], [5, 13800], [3, 13400], [4, 13000], [3, 12900], [5, 12600], [4, 12350]].forEach(([c, v], i) => B(14, c, v, T - 75 * MIN + i * 6 * MIN));
  // ---- #15 awarded, Nile Tech must sign (supplier demo) — runner-up Giza
  A({ id: 15, category_id: 1, title: "12 server racks 42U", quantity: 12, specifications: "42U, 600x1000 mm, perforated doors, cable management, PDU-ready, delivered and installed.", budget_ceiling: 21000, bid_bond_amount: 1000, start_time: T - 5 * HOUR, end_time: T - 4 * HOUR, delivery_deadline: T + 30 * DAY, status: "AWARDED", invited: [3, 4, 5], created_at: T - 3 * DAY });
  P(15, 3, "APPROVED", ["ISO 9001", "Datasheet"], T - 2 * DAY, "Vendor #6"); P(15, 4, "APPROVED", ["ISO 9001"], T - 2 * DAY, "Vendor #2"); P(15, 5, "APPROVED", ["Datasheet"], T - 2 * DAY, "Vendor #11");
  D(15, 3, 1000, "HELD", T - 2 * DAY); D(15, 4, 1000, "HELD", T - 2 * DAY); D(15, 5, 1000, "RELEASED", T - 2 * DAY);
  [[5, 20600], [4, 20100], [3, 19700], [5, 19800], [4, 19250], [3, 18900]].forEach(([c, v], i) => B(15, c, v, T - 5 * HOUR + (i + 1) * 8 * MIN));
  K(15, 3, 1, 18900, "PENDING_SIGN", T - 3 * HOUR, { sign_deadline: T + 45 * HOUR });
  // ---- #16 expired
  A({ id: 16, category_id: 5, title: "Diesel generators 50 kVA x 3", quantity: 3, specifications: "Silent canopy, ATS panel, 1-year service contract.", budget_ceiling: 36000, bid_bond_amount: 1800, start_time: T - 2 * DAY, end_time: T - 2 * DAY + HOUR, delivery_deadline: T + 20 * DAY, status: "EXPIRED", invited: [5, 6], created_at: T - 5 * DAY });
  P(16, 6, "APPROVED", ["Commercial register"], T - 3 * DAY, "Vendor #7"); D(16, 6, 1800, "RELEASED", T - 3 * DAY);
  // ---- #17 LIVE (the design's example)
  A({ id: 17, category_id: 1, title: "100 Laptops - Core i7, 16 GB RAM", quantity: 100, specifications: "15.6\" FHD, Core i7, 16 GB RAM, 512 GB SSD, 3-year warranty, ISO-certified supplier.", budget_ceiling: 50000, bid_bond_amount: 2500, start_time: T - 7 * MIN, end_time: T + 4 * MIN + 30 * SEC, soft_close_window_sec: 120, extension_sec: 60, delivery_deadline: T + 37 * DAY, status: "LIVE", invited: [3, 4, 5, 6], created_at: T - 4 * DAY });
  P(17, 3, "APPROVED", ["ISO 9001", "Datasheet"], T - 3 * DAY, "Vendor #2"); P(17, 5, "APPROVED", ["Datasheet"], T - 3 * DAY, "Vendor #5"); P(17, 4, "APPROVED", ["ISO 9001", "Sample report"], T - 3 * DAY, "Vendor #3"); P(17, 6, "REJECTED", ["No certifications"], T - 3 * DAY);
  [3, 4, 5].forEach((c) => D(17, c, 2500, "HELD", T - 3 * DAY));
  [[3, 49500], [5, 49000], [4, 48600], [3, 48000], [5, 47600], [3, 47200], [4, 46800]].forEach(([c, v], i) => B(17, c, v, T - 6 * MIN + i * 45 * SEC));
  db.bots[17] = { 4: { floor: 45200, nextAt: T + 9 * SEC }, 5: { floor: 45850, nextAt: T + 16 * SEC } };
  // ---- #18 prequalification, buyer reviews
  A({ id: 18, category_id: 2, title: "250 ergonomic office chairs", quantity: 250, specifications: "Mesh back, adjustable lumbar support, 4D armrests, BIFMA-certified, 5-year warranty.", budget_ceiling: 37500, min_decrement: 25, bid_bond_amount: 1500, start_time: T + 18 * MIN, end_time: T + 30 * MIN, delivery_deadline: T + 45 * DAY, status: "PREQUALIFICATION", invited: [5, 6, 7], created_at: T - DAY });
  P(18, 7, "PENDING", ["ISO 9001", "BIFMA certificate"], T - 3 * HOUR); D(18, 7, 1500, "HELD", T - 3 * HOUR);
  P(18, 5, "PENDING", ["Datasheet"], T - 2 * HOUR); D(18, 5, 1500, "HELD", T - 2 * HOUR);
  P(18, 6, "REJECTED", ["No certifications"], T - 5 * HOUR);
  // ---- #19 prequalification, Nile can apply
  A({ id: 19, category_id: 4, title: "48-port PoE switches x 20", quantity: 20, specifications: "48x 1GbE PoE+ (740 W budget), 4x 10G SFP+ uplinks, L3 lite, rack-mount, lifetime warranty.", budget_ceiling: 9600, min_decrement: 25, bid_bond_amount: 500, start_time: T + 25 * MIN, end_time: T + 35 * MIN, delivery_deadline: T + 28 * DAY, status: "PREQUALIFICATION", invited: [3, 4, 5], created_at: T - 6 * HOUR });
  P(19, 4, "PENDING", ["ISO 9001", "Datasheet"], T - HOUR); D(19, 4, 500, "HELD", T - HOUR);
  // ---- #20 LIVE, other buyer (admin monitor)
  A({ id: 20, buyer_company_id: 2, created_by: 8, category_id: 6, title: "Vaccine refrigerators x 8", quantity: 8, specifications: "WHO PQS-listed, +2 to +8 °C, data logger, 72h holdover.", budget_ceiling: 28000, bid_bond_amount: 1400, start_time: T - 4 * MIN, end_time: T + 9 * MIN, soft_close_window_sec: 120, extension_sec: 60, delivery_deadline: T + 21 * DAY, status: "LIVE", invited: [4, 5, 7], created_at: T - 2 * DAY });
  P(20, 4, "APPROVED", ["ISO 13485"], T - DAY, "Vendor #7"); P(20, 5, "APPROVED", ["Datasheet"], T - DAY, "Vendor #1"); P(20, 7, "APPROVED", ["ISO 9001"], T - DAY, "Vendor #10");
  [4, 5, 7].forEach((c) => D(20, c, 1400, "HELD", T - DAY));
  [[5, 27500], [7, 27000], [4, 26400]].forEach(([c, v], i) => B(20, c, v, T - 3 * MIN + i * 50 * SEC));
  // ---- #21 scheduled, Nile approved
  A({ id: 21, category_id: 3, title: "Toner cartridges x 400", quantity: 400, specifications: "Original OEM toner for HP LaserJet M404/M428 (CF259X), sealed, 18-month shelf life.", budget_ceiling: 12000, min_decrement: 25, bid_bond_amount: 600, start_time: T + 2 * MIN + 30 * SEC, end_time: T + 9 * MIN, soft_close_window_sec: 90, extension_sec: 45, delivery_deadline: T + 14 * DAY, status: "SCHEDULED", invited: [3, 4, 6], created_at: T - DAY });
  P(21, 3, "APPROVED", ["ISO 9001", "OEM authorization"], T - 20 * HOUR, "Vendor #8"); P(21, 4, "APPROVED", ["OEM authorization"], T - 20 * HOUR, "Vendor #3"); P(21, 6, "APPROVED", ["Commercial register"], T - 20 * HOUR, "Vendor #12");
  [3, 4, 6].forEach((c) => D(21, c, 600, "HELD", T - 20 * HOUR));
  // ---- #22 draft
  A({ id: 22, category_id: 1, title: "65-inch conference displays x 10", quantity: 10, specifications: "4K, 350 nits, 16/7 rated, wall mount included, HDMI-CEC + USB-C.", budget_ceiling: 13000, bid_bond_amount: 650, start_time: T + 2 * DAY, end_time: T + 2 * DAY + HOUR, delivery_deadline: T + 40 * DAY, status: "DRAFT", invited: [3, 4, 5], created_at: T - 2 * HOUR });
  seq.auction = 22;

  // notifications & audit
  const n = (u, type, params, aid, ago, read) => db.notifications.push({ id: nid("notif"), user_id: u, type, params, auction_id: aid, is_read: !!read, created_at: T - ago });
  n(1, "prequal_new", { id: 18, name: "Cairo Office Hub" }, 18, 3 * HOUR, true);
  n(1, "prequal_new", { id: 18, name: "Delta Computers" }, 18, 2 * HOUR);
  n(1, "auction_closed", { id: 14 }, 14, 22 * MIN);
  n(1, "auction_live", { id: 17 }, 17, 7 * MIN);
  n(2, "awarded_you", { id: 15 }, 15, 3 * HOUR);
  n(2, "invited", { id: 19, title: "48-port PoE switches x 20" }, 19, 6 * HOUR);
  n(2, "room_open", { id: 17, title: "100 Laptops - Core i7, 16 GB RAM" }, 17, 7 * MIN);
  n(2, "outbid", { id: 17, amount: money(46800) }, 17, 75 * SEC);
  n(3, "company_pending", { name: "Alexandria Industrial" }, null, 1.2 * DAY);
  n(3, "company_pending", { name: "Sinai Medical Supplies" }, null, 3.6 * HOUR);
  const au = (ago, actor, action, details, aid) => db.audit.push({ id: nid("audit"), at: T - ago, actor, action, details, auction_id: aid ?? null });
  au(75 * SEC, "Giza Electronics", "BID_PLACED", "#17 Vendor #3 → $46,800", 17);
  au(7 * MIN, "scheduler", "STATUS", "#17 SCHEDULED → LIVE", 17);
  au(22 * MIN, "scheduler", "STATUS", "#14 LIVE → CLOSED (8 bids)", 14);
  au(2 * HOUR, "Delta Computers", "PREQUAL_SUBMITTED", "#18 documents + bond $1,500 held", 18);
  au(3 * HOUR, "Sara Hassan", "AWARDED", "#15 → Nile Tech Supplies at $18,900 (award_order 1)", 15);
  au(3.6 * HOUR, "Sinai Medical Supplies", "COMPANY_REGISTERED", "Awaiting verification");
  au(1.2 * DAY, "Alexandria Industrial", "COMPANY_REGISTERED", "Awaiting verification");
  au(2 * DAY, "scheduler", "STATUS", "#16 LIVE → EXPIRED (no valid bids)", 16);
  au(34 * DAY, "Mona Adel", "COMPANY_REJECTED", "FastDeal General Trading: expired trade licence");
  db.audit.sort((x, y) => y.at - x.at);
  for (const a of db.auctions) if (isLive(a)) bidsOf(a.id).sort((x, y) => x.placed_at - y.placed_at).forEach((b) => trace(a.id, "4.4", `broadcast {lowest:${money(b.amount)}, by:"${b.anon_label}"}`));
}

/* ============================================================
   Engine (what the Node + Redis back end will do)
   ============================================================ */
const coName = (cid) => co(cid)?.name ?? "?";
function setStatus(a, s, actor = "scheduler") { audit(actor, "STATUS", `#${a.id} ${a.status} → ${s}`, a.id); a.status = s; }

const engine = {
  createAuction(f, uid, publish) {
    const u = usr(uid); const id = nid("auction"); const now = clock.now();
    const a = { id, buyer_company_id: u.company_id, created_by: uid, category_id: +f.category, title: f.title.trim(), specifications: f.specs.trim(), quantity: +f.qty, delivery_deadline: new Date(f.delivery).getTime(), budget_ceiling: +f.budget, min_decrement: +f.min_dec, bid_bond_amount: +f.bond, start_time: now + +f.start_in * MIN, end_time: now + (+f.start_in + +f.duration) * MIN, soft_close_window_sec: +f.window, extension_sec: +f.ext, status: "DRAFT", current_lowest_bid: null, invited: f.invited.slice(), anon: {}, extensions: 0, penalty_terms: f.penalty || DEFAULT_PENALTY, created_at: now };
    db.auctions.push(a); audit(u.full_name, "AUCTION_CREATED", `#${id} <bdi>${a.title}</bdi>`, id);
    if (publish) engine.publish(a, uid);
    return a;
  },
  publish(a, uid) {
    const now = clock.now();
    if (a.start_time < now + MIN) { const d = a.end_time - a.start_time; a.start_time = now + 3 * MIN; a.end_time = a.start_time + d; }
    setStatus(a, "PREQUALIFICATION", usr(uid).full_name);
    a.pendingApps = [];
    for (const cid of a.invited) {
      notify(usersOf(cid), "invited", { id: a.id, title: a.title }, a.id);
      if (co(cid).bot) a.pendingApps.push({ cid, at: now + rand(4, 14) * SEC });
    }
  },
  apply(aid, cid, uid, docs, ref) {
    const a = auc(aid); const now = clock.now();
    if (prequalOf(aid, cid)) return;
    db.prequals.push({ id: nid("prequal"), auction_id: aid, supplier_company_id: cid, documents: docs, status: "PENDING", reviewed_by: null, submitted_at: now, reviewed_at: null });
    if (a.bid_bond_amount > 0) db.deposits.push({ id: nid("deposit"), auction_id: aid, supplier_company_id: cid, amount: a.bid_bond_amount, status: "HELD", gateway_ref: ref || gwRef(), created_at: now });
    audit(coName(cid), "PREQUAL_SUBMITTED", `#${aid} ${docs.join(", ")}${a.bid_bond_amount ? " + bond " + money(a.bid_bond_amount) + " held" : ""}`, aid);
    notify(usersOf(a.buyer_company_id), "prequal_new", { id: aid, name: coName(cid) }, aid);
  },
  approve(pq, uid) {
    const a = auc(pq.auction_id);
    const dep = depositOf(a.id, pq.supplier_company_id);
    if (a.bid_bond_amount > 0 && (!dep || dep.status !== "HELD")) return false;
    pq.status = "APPROVED"; pq.reviewed_by = uid; pq.reviewed_at = clock.now();
    const label = assignLabel(a, pq.supplier_company_id);
    audit(usr(uid).full_name, "PREQUAL_APPROVED", `#${a.id} ${coName(pq.supplier_company_id)} as ${label}`, a.id);
    notify(usersOf(pq.supplier_company_id), "prequal_approved", { id: a.id, label }, a.id);
    if (a.status === "PREQUALIFICATION") { setStatus(a, "SCHEDULED", usr(uid).full_name); notify(approvedOf(a.id).flatMap(usersOf), "scheduled", { id: a.id }, a.id); }
    return true;
  },
  reject(pq, uid) {
    const a = auc(pq.auction_id);
    pq.status = "REJECTED"; pq.reviewed_by = uid; pq.reviewed_at = clock.now();
    const dep = depositOf(a.id, pq.supplier_company_id); if (dep && dep.status === "HELD") dep.status = "RELEASED";
    audit(usr(uid).full_name, "PREQUAL_REJECTED", `#${a.id} ${coName(pq.supplier_company_id)}`, a.id);
    notify(usersOf(pq.supplier_company_id), "prequal_rejected", { id: a.id }, a.id);
  },
  startNow(a, uid) {
    const now = clock.now();
    if (a.status === "PREQUALIFICATION") { if (!approvedOf(a.id).length) return false; setStatus(a, "SCHEDULED", usr(uid).full_name); }
    if (a.status !== "SCHEDULED") return false;
    const d = Math.max(3 * MIN, a.end_time - a.start_time); a.start_time = now; a.end_time = now + d;
    return true;
  },
  cancel(a, uid) {
    setStatus(a, "CANCELLED", usr(uid).full_name);
    db.deposits.filter((d) => d.auction_id === a.id && d.status === "HELD").forEach((d) => (d.status = "RELEASED"));
    notify(approvedOf(a.id).concat(prequalsOf(a.id).filter((p) => p.status === "PENDING").map((p) => p.supplier_company_id)).flatMap(usersOf), "cancelled", { id: a.id }, a.id);
  },
  placeBid(aid, cid, uid, amount) {
    const a = auc(aid); const now = clock.now(); const who = a?.anon[cid] || "?";
    if (!a || !isLive(a) || now >= a.end_time) { trace(aid, "4.1", `${who}: rejected · auction not LIVE`); return { ok: false, err: "err_not_live" }; }
    const pq = prequalOf(aid, cid), dep = depositOf(aid, cid);
    if (!pq || pq.status !== "APPROVED" || (a.bid_bond_amount > 0 && (!dep || dep.status !== "HELD"))) { trace(aid, "4.1", `${who}: rejected · not eligible`); return { ok: false, err: "err_not_eligible" }; }
    trace(aid, "4.1", `${who}: JWT ok · prequal APPROVED · bond HELD`);
    amount = Math.round(Number(amount) * 100) / 100;
    if (!isFinite(amount) || amount <= 0) return { ok: false, err: "err_invalid" };
    const low = lowestBid(aid);
    if (low && low.supplier_company_id === cid) { trace(aid, "4.2", `${who}: rejected · already lowest`); return { ok: false, err: "err_already_lowest" }; }
    const max = low ? low.amount - a.min_decrement : a.budget_ceiling;
    if (amount > max) { trace(aid, "4.2", `EVAL place_bid.lua → REJECT ${money(amount)} > max ${money(max)}`); return { ok: false, err: low ? "err_not_lower" : "err_over_budget", params: { max: money(max) } }; }
    trace(aid, "4.2", `EVAL place_bid.lua → OK  lowest ${low ? money(low.amount) : "—"} → ${money(amount)}`);
    const bid = { id: nid("bid"), auction_id: aid, supplier_company_id: cid, placed_by: uid, amount, anon_label: who, placed_at: now, is_accepted: true };
    db.bids.push(bid); a.current_lowest_bid = amount;
    if (a.end_time - now <= a.soft_close_window_sec * SEC) {
      a.end_time += a.extension_sec * SEC; a.extensions++;
      if (a.status === "LIVE") { setStatus(a, "SOFT_CLOSE"); notify(usersOf(a.buyer_company_id), "softclose", { id: a.id }, a.id); }
      trace(aid, "4.3", `bid inside last ${a.soft_close_window_sec}s → end_time +${a.extension_sec}s (ext #${a.extensions})`);
    } else trace(aid, "4.3", `outside soft-close window · end_time unchanged`);
    trace(aid, "4.4", `WS broadcast room:${aid} {lowest:${money(amount)}, by:"${who}", ends_in:${Math.round((a.end_time - now) / 1000)}s}`);
    trace(aid, "4.5", `async INSERT INTO bid … id=${bid.id} placed_at=${fTimeMs(now)}`);
    audit(coName(cid), "BID_PLACED", `#${aid} ${who} → ${money(amount)}`, aid);
    if (low) notify(usersOf(low.supplier_company_id), "outbid", { id: aid, amount: money(amount) }, aid);
    return { ok: true, bid };
  },
  close(a) {
    const r = ranking(a.id);
    if (r.length) {
      setStatus(a, "CLOSED"); trace(a.id, "—", `timer ended · ranking frozen (${r.length} suppliers)`);
      notify(usersOf(a.buyer_company_id), "auction_closed", { id: a.id }, a.id);
    } else {
      setStatus(a, "EXPIRED");
      db.deposits.filter((d) => d.auction_id === a.id && d.status === "HELD").forEach((d) => (d.status = "RELEASED"));
      notify(usersOf(a.buyer_company_id), "auction_expired", { id: a.id }, a.id);
    }
  },
  award(a, uid) {
    const r = ranking(a.id); if (!r.length) return;
    const now = clock.now(); const w = r[0];
    db.contracts.push({ id: nid("contract"), auction_id: a.id, bid_id: w.id, winner_company_id: w.supplier_company_id, award_order: 1, final_price: w.amount, penalty_terms: a.penalty_terms, status: "PENDING_SIGN", awarded_at: now, sign_deadline: now + 48 * HOUR, signed_at: null, completed_at: null });
    setStatus(a, "AWARDED", usr(uid).full_name);
    const keep = new Set(r.slice(0, 2).map((b) => b.supplier_company_id));
    db.deposits.filter((d) => d.auction_id === a.id && d.status === "HELD" && !keep.has(d.supplier_company_id)).forEach((d) => (d.status = "RELEASED"));
    notify(usersOf(w.supplier_company_id), "awarded_you", { id: a.id }, a.id);
    if (r[1]) notify(usersOf(r[1].supplier_company_id), "runner_up", { id: a.id }, a.id);
    r.slice(2).forEach((b) => notify(usersOf(b.supplier_company_id), "not_awarded", { id: a.id }, a.id));
    audit(usr(uid).full_name, "AWARDED", `#${a.id} → ${coName(w.supplier_company_id)} at ${money(w.amount)} (award_order 1)`, a.id);
  },
  defaultAndFailover(c, actor) {
    const a = auc(c.auction_id); const now = clock.now();
    c.status = "DEFAULTED";
    const dep = depositOf(a.id, c.winner_company_id); if (dep) { dep.status = "FORFEITED"; dep.gateway_ref = dep.gateway_ref.replace("HLD", "FFT"); }
    audit(actor, "CONTRACT_DEFAULTED", `#${a.id} ${coName(c.winner_company_id)} · bond forfeited`, a.id);
    notify(usersOf(a.buyer_company_id), "contract_defaulted", { id: a.id }, a.id);
    const r = ranking(a.id); const next = r[c.award_order];
    if (next) {
      db.contracts.push({ id: nid("contract"), auction_id: a.id, bid_id: next.id, winner_company_id: next.supplier_company_id, award_order: c.award_order + 1, final_price: next.amount, penalty_terms: a.penalty_terms, status: "PENDING_SIGN", awarded_at: now, sign_deadline: now + 48 * HOUR, signed_at: null, completed_at: null });
      notify(usersOf(next.supplier_company_id), "failover_you", { id: a.id }, a.id);
      notify(usersOf(a.buyer_company_id), "failover_buyer", { id: a.id, name: coName(next.supplier_company_id), amount: money(next.amount) }, a.id);
      audit(actor, "FAILOVER", `#${a.id} → ${coName(next.supplier_company_id)} at ${money(next.amount)} (award_order ${c.award_order + 1})`, a.id);
      const after = r[c.award_order + 1];
      if (after) { const d2 = depositOf(a.id, after.supplier_company_id); if (d2 && d2.status === "RELEASED") { /* reserve already released */ } }
    } else {
      setStatus(a, "CANCELLED", actor);
      db.deposits.filter((d) => d.auction_id === a.id && d.status === "HELD").forEach((d) => (d.status = "RELEASED"));
    }
  },
  sign(c, uid) {
    c.status = "SIGNED"; c.signed_at = clock.now();
    audit(usr(uid).full_name, "CONTRACT_SIGNED", `#${c.auction_id} ${coName(c.winner_company_id)} at ${money(c.final_price)}`, c.auction_id);
    notify(usersOf(auc(c.auction_id).buyer_company_id), "contract_signed", { id: c.auction_id, name: coName(c.winner_company_id) }, c.auction_id);
  },
  deliver(c, uid) {
    const a = auc(c.auction_id);
    c.status = "COMPLETED"; c.completed_at = clock.now();
    setStatus(a, "COMPLETED", usr(uid).full_name);
    db.deposits.filter((d) => d.auction_id === a.id && d.status === "HELD").forEach((d) => (d.status = "RELEASED"));
    notify(usersOf(c.winner_company_id), "delivered", { id: a.id }, a.id);
  },
  verify(cid, uid, ok) {
    const c = co(cid); c.verification_status = ok ? "VERIFIED" : "REJECTED"; c.verified_at = clock.now();
    audit(usr(uid).full_name, ok ? "COMPANY_VERIFIED" : "COMPANY_REJECTED", c.name);
  },
  register(f) {
    const now = clock.now(); const cid = nid("company"); const uid = nid("user");
    db.companies.push({ id: cid, name: f.name.trim(), company_type: f.type, tax_id: f.tax.trim(), country: f.country.trim(), verification_status: "PENDING", created_at: now, docs: f.docs, bot: false });
    db.users.push({ id: uid, company_id: cid, full_name: f.person.trim(), email: f.email.trim().toLowerCase(), role: f.type, is_active: true });
    audit(f.name.trim(), "COMPANY_REGISTERED", "Awaiting verification");
    notify(admins(), "company_pending", { name: f.name.trim() });
  },
  tick() {
    const now = clock.now();
    for (const a of db.auctions) {
      if (a.pendingApps && a.pendingApps.length && (a.status === "PREQUALIFICATION" || a.status === "SCHEDULED")) {
        for (const p of a.pendingApps.filter((p) => p.at <= now)) engine.apply(a.id, p.cid, usersOf(p.cid)[0], pick([["ISO 9001", "Datasheet"], ["Commercial register", "Datasheet"], ["ISO 9001", "Sample report"]]), gwRef());
        a.pendingApps = a.pendingApps.filter((p) => p.at > now);
      }
      if (a.status === "PREQUALIFICATION" && now >= a.start_time) {
        if (approvedOf(a.id).length) setStatus(a, "SCHEDULED");
        else { setStatus(a, "EXPIRED"); db.deposits.filter((d) => d.auction_id === a.id && d.status === "HELD").forEach((d) => (d.status = "RELEASED")); notify(usersOf(a.buyer_company_id), "auction_expired", { id: a.id }, a.id); }
      }
      if (a.status === "SCHEDULED" && now >= a.start_time) {
        setStatus(a, "LIVE"); trace(a.id, "—", `room opened · WS channel room:${a.id}`);
        notify(usersOf(a.buyer_company_id), "auction_live", { id: a.id }, a.id);
        notify(approvedOf(a.id).flatMap(usersOf), "room_open", { id: a.id, title: a.title }, a.id);
      }
      if (isLive(a) && now >= a.end_time) engine.close(a);
      if (isLive(a) && db.settings.bots) runBots(a, now);
    }
    for (const c of db.contracts) if (c.status === "PENDING_SIGN" && now > c.sign_deadline) engine.defaultAndFailover(c, "scheduler");
  },
};
function runBots(a, now) {
  const bots = approvedOf(a.id).filter((cid) => co(cid).bot);
  const B = (db.bots[a.id] = db.bots[a.id] || {});
  for (const cid of bots) {
    let b = B[cid];
    if (!b) b = B[cid] = { floor: floorTo(a.budget_ceiling * rand(0.84, 0.92), a.min_decrement), nextAt: now + rand(3, 10) * SEC };
    if (now < b.nextAt) continue;
    const inWindow = a.end_time - now <= a.soft_close_window_sec * SEC;
    b.nextAt = now + (inWindow ? rand(5, 16) : rand(6, 18)) * SEC;
    const low = lowestBid(a.id);
    if (low && low.supplier_company_id === cid) continue;
    if (Math.random() < (inWindow ? 0.4 : 0.25)) continue;
    const top = low ? low.amount : a.budget_ceiling + a.min_decrement;
    let amt = top - a.min_decrement * pick([1, 1, 1, 2, 2, 3, 4, 6]);
    // bots keep part of their margin for the end: outside the soft-close window they stop at a "soft floor"
    const floor = inWindow ? b.floor : b.floor + (a.budget_ceiling - b.floor) * 0.35;
    if (!inWindow) amt = Math.max(amt, top - a.min_decrement * 2);
    if (amt < floor) { if (top - a.min_decrement >= floor) amt = floorTo(top - a.min_decrement, a.min_decrement); else continue; }
    engine.placeBid(a.id, cid, usersOf(cid)[0], amt);
  }
}
seed();

/* ============================================================
   UI primitives
   ============================================================ */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);
const ICONS = {
  dash: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z", list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01", plus: "M12 5v14M5 12h14",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5", bolt: "M13 2L3 14h9l-1 8 10-12h-9z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  card: "M2 5h20v14H2zM2 10h20", clock: "M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z", globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6", back: "M19 12H5M12 19l-7-7 7-7", next: "M5 12h14M12 5l7 7-7 7",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", wifi: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  check: "M20 6L9 17l-5-5", x: "M18 6L6 18M6 6l12 12", room: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6", copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01", warn: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
};
const Icon = ({ n, cls }) => html`<svg class=${"ic " + (cls || "")} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d=${ICONS[n]} /></svg>`;
const KIND = { DRAFT: "neutral", PREQUALIFICATION: "info", SCHEDULED: "info", LIVE: "ok", SOFT_CLOSE: "warn", CLOSED: "neutral", AWARDED: "info", COMPLETED: "ok", CANCELLED: "danger", EXPIRED: "danger", PENDING_SIGN: "warn", SIGNED: "info", DEFAULTED: "danger", PENDING: "warn", APPROVED: "ok", REJECTED: "danger", HELD: "info", RELEASED: "neutral", FORFEITED: "danger", VERIFIED: "ok" };
const Pill = ({ kind, dot, children }) => html`<span class=${"pill pill-" + (kind || "neutral")}>${dot ? html`<i class="dot"></i>` : null}${children}</span>`;
function Status({ s }) { const { t } = useApp(); return html`<${Pill} key=${s} kind=${KIND[s]} dot=${s === "LIVE" || s === "SOFT_CLOSE"}>${t("st_" + s)}<//>`; }
function AnimNum({ value, start, format = (v) => Math.round(v).toLocaleString("en-US"), ms = 900 }) {
  const init = REDUCE ? value : start ?? 0;
  const [disp, setDisp] = useState(init); const cur = useRef(init); const raf = useRef(0);
  useEffect(() => {
    if (REDUCE) { cur.current = value; setDisp(value); return; }
    const a = cur.current, b = value; if (a === b) return;
    const t0 = performance.now(); cancelAnimationFrame(raf.current);
    const step = (now) => { const p = Math.min(1, (now - t0) / ms); const e = 1 - Math.pow(1 - p, 3); const v = a + (b - a) * e; cur.current = v; setDisp(v); if (p < 1) raf.current = requestAnimationFrame(step); };
    raf.current = requestAnimationFrame(step); return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return format(disp);
}
function useIndicator(ref) {
  const [st, setSt] = useState(null);
  React.useLayoutEffect(() => {
    const c = ref.current; const el = c && c.querySelector(".on");
    if (!el) { if (st) setSt(null); return; }
    const n = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
    if (!st || n.x !== st.x || n.y !== st.y || n.w !== st.w || n.h !== st.h) setSt(n);
  });
  return st;
}
const BURST_COLORS = ["#22C55E", "#7EE2A8", "#F3C35A", "#8DB4FF", "#14924A", "#ffffff"];
const Burst = () => html`<span class="burst" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => html`<i key=${i} style=${{ "--a": i * 20 + "deg", "--d": 46 + (i % 3) * 20 + "px", background: BURST_COLORS[i % 6] }}></i>`)}</span>`;
const Kpi = ({ label, value, num, fmt, sub, tone }) => html`<div class="kpi"><div class="kpi-label">${label}</div><div class=${"kpi-value " + (tone || "")}>${num != null ? html`<${AnimNum} value=${num} format=${fmt} />` : value}</div>${sub ? html`<div class="kpi-sub">${sub}</div>` : null}</div>`;
const Card = ({ title, sub, right, children, cls }) => html`<section class=${"card " + (cls || "")}>${title ? html`<div class="card-head"><div><h2>${title}</h2>${sub ? html`<p>${sub}</p>` : null}</div>${right || null}</div>` : null}${children}</section>`;
function PageHead({ title, sub, right }) { return html`<div class="page-head"><div><h1>${title}</h1>${sub ? html`<p>${sub}</p>` : null}</div>${right ? html`<div class="row">${right}</div>` : null}</div>`; }
function Modal({ title, onClose, children, wide }) {
  useEffect(() => { const k = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  return html`<div class="overlay" onMouseDown=${(e) => { if (e.target === e.currentTarget) onClose(); }}><div class=${"modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true"><div class="modal-head"><h3>${title}</h3><button class="icon-btn" onClick=${onClose} aria-label="Close"><${Icon} n="x" /></button></div><div class="modal-body">${children}</div></div></div>`;
}
const Callout = ({ kind, icon, children }) => html`<div class=${"callout " + kind}><${Icon} n=${icon || "info"} /><div>${children}</div></div>`;
function Countdown({ to, cls }) { const r = to - clock.now(); return html`<span class=${"mono " + (cls || "")}>${dur(r)}</span>`; }

function niceMax(m) { if (m <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(m))); const n = m / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
function BarChart({ data, format = money, hlLast }) {
  const W = 640, H = 230, pl = 52, pr = 10, pt = 24, pb = 30;
  const max = niceMax(Math.max(1, ...data.map((d) => d.value)));
  const bw = (W - pl - pr) / data.length;
  return html`<svg class="chart" viewBox=${`0 0 ${W} ${H}`} role="img">
    ${[0, 0.25, 0.5, 0.75, 1].map((f) => { const y = pt + (H - pt - pb) * (1 - f); return html`<g key=${f}><line x1=${pl} x2=${W - pr} y1=${y} y2=${y} class="grid" /><text x=${pl - 8} y=${y + 4} class="axis" text-anchor="end">${format(max * f, true)}</text></g>`; })}
    ${data.map((d, i) => { const h = (H - pt - pb) * (d.value / max); const x = pl + i * bw + bw * 0.22; const y = H - pb - h; const w = bw * 0.56;
      return html`<g key=${i}><rect style=${{ "--i": i }} x=${x} y=${y} width=${w} height=${Math.max(0, h)} rx="4" class=${"bar" + (hlLast && i === data.length - 1 ? " bar-hl" : "")}><title>${d.label}: ${format(d.value)}</title></rect>${d.value > 0 ? html`<text style=${{ "--i": i }} x=${x + w / 2} y=${y - 7} text-anchor="middle" class="val">${format(d.value, true)}</text>` : null}<text x=${x + w / 2} y=${H - 10} text-anchor="middle" class="axis">${d.label}</text></g>`; })}
  </svg>`;
}
function PriceChart({ a, mine, height = 210 }) {
  const { t } = useApp();
  const bids = bidsOf(a.id).slice().sort((x, y) => x.placed_at - y.placed_at);
  const now = clock.now();
  const t0 = a.start_time, t1 = Math.max(Math.min(now, a.end_time), t0 + MIN);
  const W = 640, H = height, pl = 58, pr = 14, pt = 18, pb = 26;
  let low = null; const pts = [];
  for (const b of bids) if (low === null || b.amount < low) { low = b.amount; pts.push([b.placed_at, low]); }
  const ymax = a.budget_ceiling;
  const minV = Math.min(ymax * 0.9, ...bids.map((b) => b.amount));
  const ymin = floorTo(minV - (ymax - minV) * 0.08, a.min_decrement);
  const X = (tt) => pl + (W - pl - pr) * Math.min(1, Math.max(0, (tt - t0) / (t1 - t0)));
  const Y = (v) => pt + (H - pt - pb) * (1 - (v - ymin) / (ymax - ymin));
  let d = `M${X(t0)},${Y(ymax)}`;
  for (const [tt, v] of pts) d += ` H${X(tt)} V${Y(v)}`;
  d += ` H${X(t1)}`;
  const area = d + ` V${H - pb} H${X(t0)} Z`;
  const ticks = [0, 1, 2, 3].map((i) => ymin + ((ymax - ymin) * i) / 3);
  const last = pts[pts.length - 1];
  return html`<svg class="chart" viewBox=${`0 0 ${W} ${H}`} role="img" aria-label=${t("price_curve")}>
    ${ticks.map((v, i) => html`<g key=${i}><line x1=${pl} x2=${W - pr} y1=${Y(v)} y2=${Y(v)} class="grid" /><text x=${pl - 8} y=${Y(v) + 4} class="axis" text-anchor="end">${money(v, true)}</text></g>`)}
    <text x=${pl} y=${H - 6} class="axis">${fTime(t0).slice(0, 5)}</text><text x=${W - pr} y=${H - 6} class="axis" text-anchor="end">${fTime(t1).slice(0, 5)}</text>
    <line x1=${pl} x2=${W - pr} y1=${Y(ymax)} y2=${Y(ymax)} class="budget" /><text x=${W - pr - 4} y=${Y(ymax) + 14} class="budget-t" text-anchor="end">${t("d_budget")} ${money(ymax)}</text>
    <path d=${area} class="area" /><path d=${d} class="line" pathLength="1" />
    ${bids.map((b) => html`<circle key=${b.id} cx=${X(b.placed_at)} cy=${Y(b.amount)} r=${b.supplier_company_id === mine ? 4 : 3} class=${"dot" + (b.supplier_company_id === mine ? " me" : "")} />`)}
    ${last ? html`<circle cx=${X(last[0])} cy=${Y(last[1])} r="6" class="end-ring" /><circle cx=${X(last[0])} cy=${Y(last[1])} r="6" class="end" />` : null}
  </svg>`;
}
const FLOW = ["DRAFT", "PREQUALIFICATION", "SCHEDULED", "LIVE", "CLOSED", "AWARDED", "COMPLETED"];
function Lifecycle({ s }) {
  const { t } = useApp();
  const idx = FLOW.indexOf(s === "SOFT_CLOSE" ? "LIVE" : s);
  return html`<div class="flow" aria-label=${t("lifecycle")}>${FLOW.map((x, i) => html`<${React.Fragment} key=${x}>${i > 0 ? html`<span style=${{ "--i": i }} class=${"bar" + (idx >= i ? " done" : "")}></span>` : null}<span style=${{ "--i": i }} class=${"st" + (i < idx || (idx === FLOW.length - 1 && i === idx) ? " done" : "") + (i === idx ? " cur" : "")}><i>${i < idx || (s === "COMPLETED" && i === idx) ? "✓" : i + 1}</i>${x === "LIVE" && s === "SOFT_CLOSE" ? t("st_SOFT_CLOSE") : t("st_" + x)}</span><//>`)}${idx < 0 ? html`<span style=${{ marginInlineStart: "12px" }}><${Status} s=${s} /></span>` : null}</div>`;
}
function monthBuckets(lang, n = 6) {
  const now = new Date(clock.now()); const out = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); out.push({ from: d.getTime(), to: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(), label: new Intl.DateTimeFormat(loc(lang), { month: "short" }).format(d), value: 0 }); }
  return out;
}

/* ============================================================
   Shared auction widgets
   ============================================================ */
function TracePanel({ aid }) {
  const { t } = useApp(); const rows = db.trace[aid] || [];
  return html`<div class="trace" aria-live="polite">${rows.length ? rows.slice(0, 40).map((r) => html`<div key=${r.k}><span class="t">${fTimeMs(r.at)}</span><span class="step">${r.step}</span>${r.msg}</div>`) : html`<div>${t("trace_empty")}</div>`}</div>`;
}
function LivePanel({ a, reveal }) {
  const { t } = useApp();
  const r = ranking(a.id); const low = r[0]; const now = clock.now();
  const remain = a.end_time - now;
  if (a.status === "SCHEDULED" || a.status === "PREQUALIFICATION" || a.status === "DRAFT") return html`<${Card}><div class="timer-box"><div class="lbl">${t("starts_in")}</div><div class="timer">${dur(a.start_time - now)}</div><p class="muted">${t("not_live_yet")}</p></div><//>`;
  return html`<div class="grid g-main">
    <div class="stack" style=${{ gap: "16px" }}>
      <div class="grid g3">
        <div class="kpi timer-box" style=${{ position: "relative" }}>${a.extensions && isLive(a) ? html`<span key=${"x" + a.extensions} class="ext-float">+${a.extension_sec}s</span>` : null}<div class="kpi-label">${isLive(a) ? t("time_remaining") : t("ended")}</div><div class=${"kpi-value " + (isLive(a) && remain < 60 * SEC ? "bad" : "")}>${isLive(a) ? dur(remain) : "00:00"}</div>${a.status === "SOFT_CLOSE" ? html`<span class="softclose">${t("softclose_active", { e: a.extension_sec + "s" })}</span>` : html`<div class="kpi-sub">${t("extensions")}: ${a.extensions}</div>`}</div>
        <div class="kpi"><div class="kpi-label">${t("lowest")}</div><div key=${low ? low.id : 0} class="kpi-value good pricein">${low ? money(low.amount) : "—"}</div><div class="kpi-sub">${low ? (reveal ? coName(low.supplier_company_id) : low.anon_label) : t("no_bids_yet").split(".")[0]}</div></div>
        <div class="kpi"><div class="kpi-label">${t("saving_so_far")}</div><div class="kpi-value">${low ? money(a.budget_ceiling - low.amount) : "$0"}</div><div class="kpi-sub">${low ? pct((a.budget_ceiling - low.amount) / a.budget_ceiling) : "0%"} · ${t("bids_n", { n: bidsOf(a.id).length })}</div></div>
      </div>
      <${Card} title=${t("price_curve")}><${PriceChart} a=${a} /><//>
      <${Card} title=${t("engine_trace")} sub=${t("engine_trace_sub")}><${TracePanel} aid=${a.id} /><//>
    </div>
    <${Card} title=${t("live_ranking")} sub=${reveal ? t("live_ranking_admin") : t("live_ranking_sub")}>
      ${r.length ? html`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_rank")}</th><th>${reveal ? t("col_supplier") : t("col_label")}</th><th class="r">${t("col_final")}</th><th>${t("col_time")}</th></tr></thead><tbody>
        ${r.map((b, i) => html`<tr key=${b.supplier_company_id} class=${i === 0 ? "hl" : ""}><td class="num">${i + 1}</td><td>${reveal ? html`${coName(b.supplier_company_id)} <span class="muted small">${b.anon_label}</span>` : b.anon_label}</td><td class="r num"><b>${money(b.amount)}</b></td><td class="num muted">${fTime(b.placed_at)}</td></tr>`)}
      </tbody></table></div>` : html`<div class="empty">${t("trace_empty")}</div>`}
    <//>
  </div>`;
}

/* ============================================================
   Buyer views
   ============================================================ */
function BuyerDashboard() {
  const { t, user, go, lang } = useApp(); const cid = user.company_id;
  const mine = db.auctions.filter((a) => a.buyer_company_id === cid);
  const done = mine.filter((a) => a.status === "COMPLETED");
  const savings = done.reduce((s, a) => s + (a.budget_ceiling - finalPrice(a)), 0);
  const budgets = done.reduce((s, a) => s + a.budget_ceiling, 0);
  const spend = db.contracts.filter((c) => auc(c.auction_id).buyer_company_id === cid && c.status !== "DEFAULTED").reduce((s, c) => s + c.final_price, 0);
  const live = mine.filter(isLive);
  const active = mine.filter((a) => ["PREQUALIFICATION", "SCHEDULED", "LIVE", "SOFT_CLOSE"].includes(a.status));
  const months = monthBuckets(lang);
  for (const c of db.contracts) { if (c.status !== "COMPLETED") continue; const a = auc(c.auction_id); if (a.buyer_company_id !== cid) continue; const m = months.find((m) => c.completed_at >= m.from && c.completed_at < m.to); if (m) m.value += a.budget_ceiling - c.final_price; }
  const att = [];
  for (const a of mine) {
    if (a.status === "CLOSED") att.push({ a, text: t("att_award"), kind: "warn" });
    const p = prequalsOf(a.id).filter((p) => p.status === "PENDING").length; if (p && ["PREQUALIFICATION", "SCHEDULED"].includes(a.status)) att.push({ a, text: t("att_prequal", { n: p }), kind: "info" });
    const c = activeContract(a.id);
    if (a.status === "AWARDED" && c?.status === "PENDING_SIGN") att.push({ a, text: t("att_sign", { name: coName(c.winner_company_id) }), kind: "neutral" });
    if (a.status === "AWARDED" && c?.status === "SIGNED") att.push({ a, text: t("att_deliver"), kind: "ok" });
  }
  return html`<div class="page">
    <${PageHead} title=${t("b_dash_title")} sub=${t("b_dash_sub", { co: coName(cid) })} right=${html`<button class="btn primary" onClick=${() => go("b-create")}><${Icon} n="plus" />${t("new_auction")}</button>`} />
    <div class="grid g4">
      <${Kpi} label=${t("k_savings")} num=${savings} fmt=${money} tone="good" sub=${t("k_completed_n", { n: done.length })} />
      <${Kpi} label=${t("k_avg_savings")} num=${budgets ? savings / budgets : 0} fmt=${(v) => pct(v)} />
      <${Kpi} label=${t("k_active")} num=${active.length} sub=${t("k_live_n", { n: live.length })} />
      <${Kpi} label=${t("k_actions")} num=${att.length} tone=${att.length ? "bad" : ""} sub=${t("k_spend") + ": " + money(spend, true)} />
    </div>
    <div class="grid g-main">
      <${Card} title=${t("savings_by_month")} sub=${t("savings_by_month_sub")}><${BarChart} data=${months} hlLast=${true} /><//>
      <${Card} title=${t("attention")}>
        ${att.length ? att.map((x, i) => html`<div class="list-item" style=${{ cursor: "pointer" }} key=${i} onClick=${() => go("b-auction", x.a.id)}><div class="grow"><div class="ellipsis"><b>#${x.a.id}</b> <bdi>${x.a.title}</bdi></div><div class="small muted">${x.text}</div></div><button class="btn sm" onClick=${() => go("b-auction", x.a.id)}>${t("open")}</button></div>`) : html`<p class="muted">${t("attention_none")}</p>`}
      <//>
    </div>
    <${Card} title=${t("live_now")}>
      ${live.length ? html`<div class="grid g3">${live.map((a) => { const low = lowestBid(a.id); return html`<div class="mini-live" key=${a.id} onClick=${() => go("b-auction", a.id)} role="button" tabindex="0" onKeyDown=${(e) => e.key === "Enter" && go("b-auction", a.id)}>
        <div class="row between"><b class="ellipsis">#${a.id} <bdi>${a.title}</bdi></b><${Status} s=${a.status} /></div>
        <div class="row between"><span class="muted small">${t("ends_in")}</span><b class="mono">${dur(a.end_time - clock.now())}</b></div>
        <div class="row between"><span class="muted small">${t("lowest")}</span><b class="mono" style=${{ color: "var(--ok)" }}>${low ? money(low.amount) : "—"}</b></div>
        <div class="progress"><span style=${{ width: (low ? Math.min(100, ((a.budget_ceiling - low.amount) / a.budget_ceiling) * 100 * 5) : 0) + "%" }}></span></div>
        <div class="small muted">${t("saving_so_far")}: ${low ? money(a.budget_ceiling - low.amount) + " (" + pct((a.budget_ceiling - low.amount) / a.budget_ceiling) + ")" : "—"}</div>
      </div>`; })}</div>` : html`<p class="muted">${t("no_live")}</p>`}
    <//>
  </div>`;
}

function AuctionsTable({ rows, onOpen, showBuyer }) {
  const { t, lang } = useApp();
  if (!rows.length) return html`<div class="tbl-wrap"><div class="empty">${t("no_rows")}</div></div>`;
  return html`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_id")}</th><th>${t("col_title")}</th>${showBuyer ? html`<th>${t("col_buyer")}</th>` : null}<th>${t("col_category")}</th><th>${t("col_status")}</th><th class="r">${t("col_budget")}</th><th class="r">${t("col_best")}</th><th class="r">${t("col_saving")}</th><th>${t("col_start")}</th></tr></thead><tbody>
    ${rows.map((a) => { const fp = finalPrice(a); return html`<tr key=${a.id} class="click" onClick=${() => onOpen(a)}><td class="num">${a.id}</td><td><b><bdi>${a.title}</bdi></b></td>${showBuyer ? html`<td>${coName(a.buyer_company_id)}</td>` : null}<td class="muted">${cat(a.category_id).name}</td><td><${Status} s=${a.status} /></td><td class="r num">${money(a.budget_ceiling)}</td><td class="r num">${fp != null ? money(fp) : "—"}</td><td class="r num" style=${{ color: "var(--ok)" }}>${fp != null ? pct((a.budget_ceiling - fp) / a.budget_ceiling) : "—"}</td><td class="muted">${fDT(a.start_time, lang)}</td></tr>`; })}
  </tbody></table></div>`;
}
function MyAuctions() {
  const { t, user, go } = useApp(); const [f, setF] = useState("all");
  const groups = { all: null, active: ["PREQUALIFICATION", "SCHEDULED", "LIVE", "SOFT_CLOSE"], closed: ["CLOSED", "AWARDED"], done: ["COMPLETED"], drafts: ["DRAFT", "CANCELLED", "EXPIRED"] };
  const mine = db.auctions.filter((a) => a.buyer_company_id === user.company_id).sort((x, y) => y.id - x.id);
  const rows = groups[f] ? mine.filter((a) => groups[f].includes(a.status)) : mine;
  return html`<div class="page">
    <${PageHead} title=${t("my_auctions")} right=${html`<button class="btn primary" onClick=${() => go("b-create")}><${Icon} n="plus" />${t("new_auction")}</button>`} />
    <div class="seg">${Object.keys(groups).map((k) => html`<button key=${k} class=${f === k ? "on" : ""} onClick=${() => setF(k)}>${t("f_" + k)} <span class="muted">${groups[k] ? mine.filter((a) => groups[k].includes(a.status)).length : mine.length}</span></button>`)}</div>
    <${AuctionsTable} rows=${rows} onOpen=${(a) => go("b-auction", a.id)} />
  </div>`;
}

function AuctionDetail({ id, adminMode }) {
  const { t, lang, user, go, toast } = useApp();
  const a = auc(id);
  const defaultTab = ["PREQUALIFICATION", "SCHEDULED"].includes(a.status) ? "prequal" : isLive(a) ? "live" : ["CLOSED", "AWARDED", "COMPLETED"].includes(a.status) ? "result" : "overview";
  const [tab, setTab] = useState(defaultTab);
  const prevStatus = useRef(a.status);
  useEffect(() => { if (prevStatus.current !== a.status) { const was = prevStatus.current; prevStatus.current = a.status; if (a.status === "CLOSED" || (a.status === "LIVE" && was === "SCHEDULED")) setTab(a.status === "CLOSED" ? "result" : "live"); } });
  const owner = user.role === "BUYER" && a.buyer_company_id === user.company_id;
  const tabsRef = useRef(null); const tind = useIndicator(tabsRef);
  const act = (fn, msg) => { fn(); emit(); if (msg) toast(msg, "ok"); };
  return html`<div class="page">
    <div><button class="btn ghost sm" onClick=${() => go(adminMode ? "a-live" : "b-auctions")}><${Icon} n="back" cls="flip" />${t("back")}</button></div>
    <div class="page-head"><div><div class="row"><h1>#${a.id} · <bdi>${a.title}</bdi></h1><${Status} s=${a.status} /></div><p>${coName(a.buyer_company_id)} · ${cat(a.category_id).name} · ${t("d_quantity")}: ${a.quantity}</p></div>
      ${owner ? html`<div class="row">
        ${a.status === "DRAFT" ? html`<button class="btn" onClick=${() => act(() => engine.cancel(a, user.id))}>${t("delete_draft")}</button><button class="btn primary" onClick=${() => act(() => engine.publish(a, user.id), t("created_pub", { id: a.id }))}>${t("publish")}</button>` : null}
        ${["PREQUALIFICATION", "SCHEDULED"].includes(a.status) ? html`<button class="btn" onClick=${() => act(() => engine.cancel(a, user.id))}>${t("cancel_auction")}</button><button class="btn navy" disabled=${!approvedOf(a.id).length} onClick=${() => act(() => engine.startNow(a, user.id))}><${Icon} n="bolt" />${t("start_now")}</button>` : null}
      </div>` : null}
    </div>
    <${Card}><${Lifecycle} s=${a.status} /><//>
    <div class="tabs" role="tablist" ref=${tabsRef}>${tind ? html`<span class="tab-ind" style=${{ transform: `translateX(${tind.x}px)`, width: tind.w + "px" }}></span>` : null}${["overview", "prequal", "live", "result"].map((k) => html`<button key=${k} role="tab" aria-selected=${tab === k} class=${tab === k ? "on" : ""} onClick=${() => setTab(k)}>${t("tab_" + k)}${k === "prequal" && prequalsOf(a.id).some((p) => p.status === "PENDING") ? html` <span class="badge">${prequalsOf(a.id).filter((p) => p.status === "PENDING").length}</span>` : null}${k === "live" && isLive(a) ? html` <${Pill} kind="ok" dot=${true}>${t("st_LIVE")}<//>` : null}</button>`)}</div>
    ${tab === "overview" ? html`<${AuctionOverview} a=${a} />` : null}
    ${tab === "prequal" ? html`<${PrequalTab} a=${a} owner=${owner} />` : null}
    ${tab === "live" ? html`<${LivePanel} a=${a} reveal=${adminMode} />` : null}
    ${tab === "result" ? html`<${ResultTab} a=${a} owner=${owner} />` : null}
  </div>`;
}
function AuctionOverview({ a }) {
  const { t, lang } = useApp();
  return html`<div class="grid g2">
    <${Card} title=${t("tab_overview")}><div class="kv">
      <div>${t("d_category")}</div><div>${cat(a.category_id).name}</div>
      <div>${t("d_quantity")}</div><div class="num">${a.quantity}</div>
      <div>${t("d_budget")}</div><div class="num">${money(a.budget_ceiling)}</div>
      <div>${t("d_min_dec")}</div><div class="num">${money(a.min_decrement)}</div>
      <div>${t("d_bond")}</div><div class="num">${money(a.bid_bond_amount)}</div>
      <div>${t("d_start")}</div><div>${fDT(a.start_time, lang)}</div>
      <div>${t("d_end")}</div><div>${fDT(a.end_time, lang)}</div>
      <div>${t("d_softclose")}</div><div>${t("d_softclose_v", { w: a.soft_close_window_sec + "s", e: a.extension_sec + "s" })}</div>
      <div>${t("d_delivery")}</div><div>${fDate(a.delivery_deadline, lang)}</div>
    </div><//>
    <div class="stack" style=${{ gap: "16px" }}>
      <${Card} title=${t("d_specs")}><p style=${{ margin: 0 }}>${a.specifications}</p><//>
      <${Card} title=${t("d_invited")}><div class="row">${a.invited.map((cid) => html`<${Pill} key=${cid} kind="neutral">${coName(cid)}<//>`)}</div><//>
      <${Card} title=${t("penalty_terms")}><p class="muted" style=${{ margin: 0 }}>${a.penalty_terms}</p><//>
    </div>
  </div>`;
}
function PrequalTab({ a, owner }) {
  const { t, lang, user, toast } = useApp();
  const ps = prequalsOf(a.id);
  const c = (s) => ps.filter((p) => p.status === s).length;
  return html`<${Card} title=${t("pq_title", { title: a.title })} sub=${t("pq_meta", { start: fDT(a.start_time, lang), bond: money(a.bid_bond_amount) })}>
    ${ps.length ? html`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_supplier")}</th><th>${t("col_docs")}</th><th>${t("col_bond")}</th><th>${t("col_status")}</th><th>${t("col_label")}</th>${owner ? html`<th>${t("col_action")}</th>` : null}</tr></thead><tbody>
      ${ps.map((p) => { const d = depositOf(a.id, p.supplier_company_id); return html`<tr key=${p.id}><td><b>${coName(p.supplier_company_id)}</b></td><td>${p.documents.join(", ")} <a href="#" onClick=${(e) => e.preventDefault()}>${t("view")}</a></td><td class="num">${d ? html`${money(d.amount)} <span class="muted small">${t("st_" + d.status)}</span>` : html`<span class="muted">${t("not_paid")}</span>`}</td><td><${Status} s=${p.status} /></td><td class="mono">${a.anon[p.supplier_company_id] || "—"}</td>
        ${owner ? html`<td>${p.status === "PENDING" && !["CLOSED", "AWARDED", "COMPLETED", "CANCELLED", "EXPIRED"].includes(a.status) ? html`<div class="row"><button class="btn primary sm" onClick=${() => { engine.approve(p, user.id); emit(); toast(t("st_APPROVED") + ": " + coName(p.supplier_company_id), "ok"); }}>${t("approve")}</button><button class="btn danger sm" onClick=${() => { engine.reject(p, user.id); emit(); }}>${t("reject")}</button></div>` : "—"}</td>` : null}</tr>`; })}
    </tbody></table></div>
    <p class="note">${t("pq_summary", { a: c("APPROVED"), p: c("PENDING"), r: c("REJECTED") })}</p>` : html`<div class="empty">${t("no_apps")}</div>`}
  <//>`;
}
function ResultTab({ a, owner }) {
  const { t, lang, user, toast } = useApp();
  if (["DRAFT", "PREQUALIFICATION", "SCHEDULED", "LIVE", "SOFT_CLOSE"].includes(a.status)) return html`<${Card}><div class="empty">${t("result_wait")}</div><//>`;
  const r = ranking(a.id);
  if (!r.length) return html`<${Card}><div class="empty">${t("result_none")}</div><//>`;
  const cs = contractsOf(a.id); const cur = cs[cs.length - 1];
  const win = cur && cur.status !== "DEFAULTED" ? cur : null;
  const price = win ? win.final_price : r[0].amount;
  const rowStatus = (i) => {
    const c = cs.find((c) => c.award_order === i + 1);
    if (c) return { PENDING_SIGN: ["r_winner_pending", "ok"], SIGNED: ["r_winner_signed", "ok"], COMPLETED: ["r_delivered", "ok"], DEFAULTED: ["r_defaulted", "danger"] }[c.status];
    if (a.status === "CLOSED") return i === 0 ? ["r_leading", "ok"] : i === 1 ? ["r_second", "info"] : ["r_not", "warn"];
    if (cur && a.status === "AWARDED" && i === cur.award_order && cur.status === "PENDING_SIGN") return ["r_runner", "info"];
    return ["r_not", "warn"];
  };
  const nextIdx = cur ? cur.award_order : 0;
  const copyReport = () => {
    const lines = [`Wardly · Auction #${a.id}: <bdi>${a.title}</bdi>`, `Buyer: ${coName(a.buyer_company_id)}`, `Budget ceiling: ${money(a.budget_ceiling)}`, `Winning bid: ${money(price)} · Saved ${money(a.budget_ceiling - price)} (${pct((a.budget_ceiling - price) / a.budget_ceiling)})`, `Bids: ${bidsOf(a.id).length} · Soft-close extensions: ${a.extensions}`, "", "Ranking:", ...r.map((b, i) => `${i + 1}. ${coName(b.supplier_company_id)} (${b.anon_label}) ${money(b.amount)} at ${fTime(b.placed_at)}`), "", "Contracts:", ...cs.map((c) => `award_order ${c.award_order}: ${coName(c.winner_company_id)} ${money(c.final_price)} · ${c.status}`)];
    try { navigator.clipboard.writeText(lines.join("\n")).then(() => toast(t("report_copied"), "ok"), () => toast(t("copy_failed"), "err")); } catch (e) { toast(t("copy_failed"), "err"); }
  };
  const act = (fn) => { fn(); emit(); };
  return html`<div class="stack" style=${{ gap: "16px" }}>
    <${Card} title=${t("result_title", { title: a.title })} sub=${t("result_meta", { b: money(a.budget_ceiling), w: money(price), s: money(a.budget_ceiling - price), p: pct((a.budget_ceiling - price) / a.budget_ceiling) })} right=${html`<${Status} s=${a.status} />`}>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_rank")}</th><th>${t("col_supplier")}</th><th>${t("col_label")}</th><th class="r">${t("col_final")}</th><th>${t("col_bond")}</th><th>${t("col_status")}</th></tr></thead><tbody>
        ${r.map((b, i) => { const st = rowStatus(i); const d = depositOf(a.id, b.supplier_company_id); return html`<tr key=${b.id}><td class="num"><b>${i + 1}</b></td><td><b>${coName(b.supplier_company_id)}</b></td><td class="mono muted">${b.anon_label}</td><td class="r num"><b>${money(b.amount)}</b></td><td>${d ? html`${money(d.amount)} <${Status} s=${d.status} />` : "—"}</td><td><${Pill} kind=${st[1]}>${t(st[0])}<//></td></tr>`; })}
      </tbody></table></div>
      ${owner ? html`<div class="row" style=${{ marginTop: "14px" }}>
        ${a.status === "CLOSED" ? html`<button class="btn primary" onClick=${() => act(() => engine.award(a, user.id))}>${t("award_to", { n: 1, name: coName(r[0].supplier_company_id) })}</button>` : null}
        ${a.status === "AWARDED" && cur?.status === "PENDING_SIGN" && r[nextIdx] ? html`<button class="btn danger" onClick=${() => act(() => engine.defaultAndFailover(cur, user.full_name))}>${t("failover_btn", { n: nextIdx + 1 })}</button>` : null}
        ${a.status === "AWARDED" && cur?.status === "SIGNED" ? html`<button class="btn primary" onClick=${() => act(() => engine.deliver(cur, user.id))}><${Icon} n="check" />${t("confirm_delivery")}</button>` : null}
        <button class="btn" onClick=${copyReport}><${Icon} n="copy" />${t("copy_report")}</button>
      </div>` : null}
    <//>
    ${cur ? html`<${Card} title=${t("timeline")}>
      <div class="timeline">
        <${Pill} kind="ok">✓ ${t("tl_closed")}<//><span class="arrow">${lang === "ar" ? "←" : "→"}</span>
        <${Pill} kind="ok">✓ ${t("tl_awarded", { n: cur.award_order })}<//><span class="arrow">${lang === "ar" ? "←" : "→"}</span>
        ${cur.status === "PENDING_SIGN" ? html`<${Pill} kind="warn">${t("tl_awaiting", { t: durWords(cur.sign_deadline - clock.now()) })}<//>` : cur.status === "DEFAULTED" ? html`<${Pill} kind="danger">${t("st_DEFAULTED")}<//>` : html`<${Pill} kind="ok">✓ ${t("tl_signed")}<//>`}<span class="arrow">${lang === "ar" ? "←" : "→"}</span>
        <${Pill} kind=${cur.status === "COMPLETED" ? "ok" : "info"}>${cur.status === "COMPLETED" ? "✓ " : ""}${t("tl_delivery")}<//><span class="arrow">${lang === "ar" ? "←" : "→"}</span>
        <${Pill} kind=${cur.status === "COMPLETED" ? "ok" : "info"}>${t("tl_completed")}<//>
      </div>
      ${cur.status === "PENDING_SIGN" ? html`<p class="note" style=${{ marginBottom: 0 }}>${t("failover_note", { n: cur.award_order })}</p>` : null}
    <//>
    <${Card} title=${t("contract_history")}><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_contract")}</th><th>${t("col_order")}</th><th>${t("col_supplier")}</th><th class="r">${t("col_price")}</th><th>${t("col_status")}</th><th>${t("col_deadline")}</th></tr></thead><tbody>
      ${cs.map((c) => html`<tr key=${c.id}><td class="num">C-${c.id}</td><td class="num">${c.award_order}</td><td>${coName(c.winner_company_id)}</td><td class="r num">${money(c.final_price)}</td><td><${Status} s=${c.status} /></td><td class="muted">${c.status === "PENDING_SIGN" ? fDT(c.sign_deadline, lang) : c.signed_at ? fDT(c.signed_at, lang) : "—"}</td></tr>`)}
    </tbody></table></div><//>` : null}
  </div>`;
}

const EXAMPLE = { title: "60 monitors 27-inch QHD", category: 1, specs: "27\" IPS QHD 2560x1440, 75 Hz, USB-C 65 W, height-adjustable stand, 3-year warranty.", qty: 60, budget: 18000, delivery: "", start_in: 2, duration: 5, min_dec: 50, window: 90, ext: 45, bond: 900, invited: [3, 4, 5, 6], penalty: DEFAULT_PENALTY };
function CreateAuction() {
  const { t, user, go, toast, lang } = useApp();
  const dl = new Date(clock.now() + 30 * DAY).toISOString().slice(0, 10);
  const [f, setF] = useState({ title: "", category: 1, specs: "", qty: "", budget: "", delivery: dl, start_in: 3, duration: 8, min_dec: 50, window: 180, ext: 120, bond: "", invited: [], penalty: DEFAULT_PENALTY });
  const [tried, setTried] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const suppliers = db.companies.filter((c) => c.company_type === "SUPPLIER" && c.verification_status === "VERIFIED");
  const err = {};
  if (!f.title.trim()) err.title = t("e_req");
  if (!f.specs.trim()) err.specs = t("e_req");
  if (!(+f.qty > 0)) err.qty = t("e_pos");
  if (!(+f.budget > 0)) err.budget = t("e_pos");
  if (!(+f.min_dec > 0)) err.min_dec = t("e_pos"); else if (+f.budget > 0 && +f.min_dec >= +f.budget) err.min_dec = t("e_dec");
  if (!(+f.start_in >= 1)) err.start_in = t("e_start");
  if (!(+f.duration >= 2)) err.duration = t("e_dur");
  if (!(+f.window >= 30)) err.window = t("e_window");
  if (!(+f.ext >= 15)) err.ext = t("e_ext");
  if (!(+f.bond >= 0) || f.bond === "") err.bond = t("e_req");
  if (!f.delivery) err.delivery = t("e_req");
  if (!f.invited.length) err.invited = t("e_invite");
  const ok = !Object.keys(err).length;
  const submit = (publish) => { setTried(true); if (!ok) return; const a = engine.createAuction(f, user.id, publish); emit(); toast(t(publish ? "created_pub" : "created_draft", { id: a.id }), "ok"); go("b-auction", a.id); };
  const F = (k, label, el, cls) => html`<div class=${"field " + (cls || "")}><label for=${"f-" + k}>${label}</label>${el}${tried && err[k] ? html`<span class="err">${err[k]}</span>` : null}</div>`;
  const inp = (k, type = "text", extra = {}) => html`<input id=${"f-" + k} class=${"input" + (tried && err[k] ? " bad" : "")} type=${type} value=${f[k]} onChange=${set(k)} ...${extra} />`;
  const now = clock.now();
  return html`<div class="page">
    <${PageHead} title=${t("create_title")} sub=${t("create_sub")} right=${html`<button class="btn ghost" onClick=${() => setF({ ...EXAMPLE, delivery: dl })}>${t("use_example")}</button>`} />
    <form class="card" onSubmit=${(e) => { e.preventDefault(); submit(true); }}>
      <div class="grid g2">
        <div class="stack" style=${{ gap: "14px" }}>
          ${F("title", t("f_title"), inp("title", "text", { placeholder: "100 Laptops - Core i7, 16 GB RAM" }))}
          ${F("category", t("f_category"), html`<select id="f-category" class="input" value=${f.category} onChange=${set("category")}>${db.categories.map((c) => html`<option key=${c.id} value=${c.id}>${c.name}</option>`)}</select>`)}
          ${F("specs", t("f_specs"), html`<textarea id="f-specs" class=${"input" + (tried && err.specs ? " bad" : "")} value=${f.specs} onChange=${set("specs")} rows="4"></textarea>`)}
          ${F("qty", t("f_qty"), inp("qty", "number", { min: 1 }))}
          ${F("invited", t("f_invite"), html`<div class="stack" style=${{ gap: "6px" }}>${suppliers.map((s) => html`<label class="check" key=${s.id}><input type="checkbox" checked=${f.invited.includes(s.id)} onChange=${(e) => setF({ ...f, invited: e.target.checked ? [...f.invited, s.id] : f.invited.filter((x) => x !== s.id) })} /><span>${s.name} <span class="muted small">${s.docs.join(" · ")}${s.bot ? "" : " · " + t("role_SUPPLIER") + " (you)"}</span></span></label>`)}</div>`)}
        </div>
        <div class="stack" style=${{ gap: "14px" }}>
          ${F("budget", t("f_budget"), inp("budget", "number", { min: 1, placeholder: "50000" }))}
          ${F("delivery", t("f_delivery"), inp("delivery", "date"))}
          <div class="grid g2">${F("start_in", t("f_start_in"), inp("start_in", "number", { min: 1 }))}${F("duration", t("f_duration"), inp("duration", "number", { min: 2 }))}</div>
          <p class="note" style=${{ margin: "-6px 0 0" }}>${t("f_schedule_hint", { start: fDT(now + (+f.start_in || 0) * MIN, lang), end: fDT(now + ((+f.start_in || 0) + (+f.duration || 0)) * MIN, lang) })}</p>
          <div class="grid g3">${F("min_dec", t("f_min_dec"), inp("min_dec", "number", { min: 1 }))}${F("window", t("f_window"), inp("window", "number", { min: 30 }))}${F("ext", t("f_ext"), inp("ext", "number", { min: 15 }))}</div>
          ${F("bond", t("f_bond"), inp("bond", "number", { min: 0, placeholder: "2500" }))}
          ${F("penalty", t("f_penalty"), html`<textarea id="f-penalty" class="input" value=${f.penalty} onChange=${set("penalty")} rows="3"></textarea>`)}
        </div>
      </div>
      <div class="row" style=${{ marginTop: "18px" }}>
        <button type="button" class="btn" onClick=${() => submit(false)}>${t("save_draft")}</button>
        <button type="submit" class="btn primary">${t("publish")}</button>
      </div>
    </form>
  </div>`;
}
function supplierStats(cid) {
  const joined = new Set(db.bids.filter((b) => b.supplier_company_id === cid).map((b) => b.auction_id));
  const wins = db.contracts.filter((c) => c.winner_company_id === cid && c.status !== "DEFAULTED");
  const defaults = db.contracts.filter((c) => c.winner_company_id === cid && c.status === "DEFAULTED").length;
  const disc = wins.map((c) => { const a = auc(c.auction_id); return (a.budget_ceiling - c.final_price) / a.budget_ceiling; });
  return { joined: joined.size, wins: wins.length, defaults, avg: disc.length ? disc.reduce((s, x) => s + x, 0) / disc.length : null, value: wins.reduce((s, c) => s + c.final_price, 0) };
}
function Suppliers() {
  const { t, lang } = useApp();
  const rows = db.companies.filter((c) => c.company_type === "SUPPLIER" && c.verification_status === "VERIFIED");
  return html`<div class="page"><${PageHead} title=${t("suppliers_title")} sub=${t("suppliers_sub")} />
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_supplier")}</th><th>${t("col_country")}</th><th>${t("docs")}</th><th>${t("col_verified_since")}</th><th class="r">${t("col_joined")}</th><th class="r">${t("col_wins")}</th><th class="r">${t("col_avg_disc")}</th><th class="r">${t("col_defaults")}</th></tr></thead><tbody>
      ${rows.map((c) => { const s = supplierStats(c.id); return html`<tr key=${c.id}><td><b>${c.name}</b></td><td>${c.country}</td><td class="muted small">${c.docs.join(", ")}</td><td class="muted">${fDate(c.created_at, lang)}</td><td class="r num">${s.joined}</td><td class="r num">${s.wins}</td><td class="r num" style=${{ color: "var(--ok)" }}>${s.avg != null ? pct(s.avg) : "—"}</td><td class="r num">${s.defaults ? html`<span style=${{ color: "var(--danger)" }}>${s.defaults}</span>` : 0}</td></tr>`; })}
    </tbody></table></div></div>`;
}
function ContractsTable({ rows, onOpen, supplierView, actions }) {
  const { t, lang } = useApp();
  if (!rows.length) return html`<div class="tbl-wrap"><div class="empty">${t("no_rows")}</div></div>`;
  return html`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_contract")}</th><th>${t("col_auction")}</th><th>${supplierView ? t("col_buyer") : t("col_supplier")}</th><th class="r">${t("col_order")}</th><th class="r">${t("col_price")}</th><th>${t("col_status")}</th><th>${t("col_deadline")}</th>${actions ? html`<th>${t("col_action")}</th>` : null}</tr></thead><tbody>
    ${rows.map((c) => { const a = auc(c.auction_id); return html`<tr key=${c.id} class=${onOpen ? "click" : ""} onClick=${() => onOpen && onOpen(c)}><td class="num">C-${c.id}</td><td><b>#${a.id}</b> <bdi>${a.title}</bdi></td><td>${supplierView ? coName(a.buyer_company_id) : coName(c.winner_company_id)}</td><td class="r num">${c.award_order}</td><td class="r num">${money(c.final_price)}</td><td><${Status} s=${c.status} /></td><td class="muted">${c.status === "PENDING_SIGN" ? html`<span class="mono" style=${{ color: "var(--warn)" }}>${durWords(c.sign_deadline - clock.now())}</span>` : c.signed_at ? fDate(c.signed_at, lang) : "—"}</td>${actions ? html`<td onClick=${(e) => e.stopPropagation()}>${actions(c)}</td>` : null}</tr>`; })}
  </tbody></table></div>`;
}
function BuyerContracts() {
  const { t, user, go } = useApp();
  const rows = db.contracts.filter((c) => auc(c.auction_id).buyer_company_id === user.company_id).sort((x, y) => y.awarded_at - x.awarded_at);
  return html`<div class="page"><${PageHead} title=${t("contracts_title")} sub=${t("contracts_sub")} /><${ContractsTable} rows=${rows} onOpen=${(c) => go("b-auction", c.auction_id)} /></div>`;
}

/* ============================================================
   Supplier views
   ============================================================ */
function SupplierDashboard() {
  const { t, user, go, lang } = useApp(); const cid = user.company_id;
  const approved = db.auctions.filter((a) => prequalOf(a.id, cid)?.status === "APPROVED");
  const rooms = approved.filter((a) => isLive(a) || a.status === "SCHEDULED").sort((x, y) => x.start_time - y.start_time);
  const closed = approved.filter((a) => ["CLOSED", "AWARDED", "COMPLETED", "CANCELLED"].includes(a.status) && bidsOf(a.id).some((b) => b.supplier_company_id === cid));
  const s = supplierStats(cid);
  const pendingSign = db.contracts.filter((c) => c.winner_company_id === cid && c.status === "PENDING_SIGN");
  const invites = db.auctions.filter((a) => a.invited.includes(cid) && ["PREQUALIFICATION", "SCHEDULED"].includes(a.status) && !prequalOf(a.id, cid));
  const results = closed.sort((x, y) => y.end_time - x.end_time).slice(0, 6);
  return html`<div class="page">
    <${PageHead} title=${t("s_dash_title")} sub=${t("s_dash_sub", { co: coName(cid) })} />
    <div class="grid g4">
      <${Kpi} label=${t("k_winrate")} value=${closed.length ? pct(s.wins / Math.max(closed.length, s.wins), 0) : "—"} sub=${t("k_winrate_sub", { w: s.wins, n: Math.max(closed.length, s.wins) })} />
      <${Kpi} label=${t("k_rooms")} value=${approved.filter(isLive).length} tone=${approved.filter(isLive).length ? "good" : ""} />
      <${Kpi} label=${t("k_won_value")} num=${s.value} fmt=${(v) => money(v, true)} />
      <${Kpi} label=${t("k_pending")} value=${pendingSign.length + invites.length} tone=${pendingSign.length + invites.length ? "bad" : ""} />
    </div>
    ${pendingSign.map((c) => html`<${Callout} key=${c.id} kind="ok" icon="file"><b>#${c.auction_id} <bdi>${auc(c.auction_id).title}</bdi></b> · ${money(c.final_price)} · ${t("tl_awaiting", { t: durWords(c.sign_deadline - clock.now()) })} <button class="btn sm primary" style=${{ marginInlineStart: "8px" }} onClick=${() => go("s-contracts")}>${t("sign")}</button><//>`)}
    <div class="grid g2">
      <${Card} title=${t("rooms_upcoming")}>
        ${rooms.length ? rooms.map((a) => html`<div class="list-item" key=${a.id}><div class="grow"><div class="ellipsis"><b>#${a.id}</b> <bdi>${a.title}</bdi></div><div class="small muted">${isLive(a) ? t("ends_in") + " " + dur(a.end_time - clock.now()) : t("starts_in") + " " + dur(a.start_time - clock.now())} · ${t("my_label", { label: a.anon[cid] })}</div></div><${Status} s=${a.status} /><button class=${"btn sm " + (isLive(a) ? "primary" : "")} onClick=${() => go("s-room", a.id)}>${t("enter_room")}</button></div>`) : html`<p class="muted">${t("no_live")}</p>`}
      <//>
      <${Card} title=${t("invitations")}>
        ${invites.length ? invites.map((a) => html`<div class="list-item" key=${a.id}><div class="grow"><div class="ellipsis"><b>#${a.id}</b> <bdi>${a.title}</bdi></div><div class="small muted">${coName(a.buyer_company_id)} · ${t("opp_bond")} ${money(a.bid_bond_amount)} · ${fDT(a.start_time, lang)}</div></div><button class="btn sm" onClick=${() => go("s-opps")}>${t("apply")}</button></div>`) : html`<p class="muted">${t("no_opps")}</p>`}
      <//>
    </div>
    <${Card} title=${t("recent_results")}>
      ${results.length ? html`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_auction")}</th><th>${t("col_buyer")}</th><th class="r">${t("your_last")}</th><th>${t("col_result")}</th></tr></thead><tbody>
        ${results.map((a) => { const mine = Math.min(...bidsOf(a.id).filter((b) => b.supplier_company_id === cid).map((b) => b.amount)); const c = contractsOf(a.id).find((c) => c.winner_company_id === cid); const r = ranking(a.id); const pos = r.findIndex((b) => b.supplier_company_id === cid) + 1;
          return html`<tr key=${a.id}><td><b>#${a.id}</b> <bdi>${a.title}</bdi></td><td>${coName(a.buyer_company_id)}</td><td class="r num">${money(mine)}</td><td>${c ? html`<${Status} s=${c.status} />` : html`<${Pill} kind=${pos === 1 ? "ok" : "neutral"}>${t("col_rank")} ${pos}<//>`}</td></tr>`; })}
      </tbody></table></div>` : html`<p class="muted">${t("no_rows")}</p>`}
    <//>
  </div>`;
}
function Opportunities() {
  const { t, user, go, lang } = useApp(); const cid = user.company_id;
  const [applyTo, setApplyTo] = useState(null);
  const opps = db.auctions.filter((a) => a.invited.includes(cid) && ["PREQUALIFICATION", "SCHEDULED", "LIVE", "SOFT_CLOSE"].includes(a.status)).sort((x, y) => x.start_time - y.start_time);
  return html`<div class="page">
    <${PageHead} title=${t("opps_title")} sub=${t("opps_sub")} />
    ${opps.length ? html`<div class="grid g3">${opps.map((a) => { const pq = prequalOf(a.id, cid); return html`<${Card} key=${a.id} cls="opp">
      <div class="row between"><b>#${a.id}</b><${Status} s=${a.status} /></div>
      <h3><bdi>${a.title}</bdi></h3>
      <dl><dt>${t("opp_buyer")}</dt><dd>${coName(a.buyer_company_id)}</dd><dt>${t("opp_qty")}</dt><dd class="num">${a.quantity}</dd><dt>${t("opp_budget")}</dt><dd class="num">${money(a.budget_ceiling)}</dd><dt>${t("opp_delivery")}</dt><dd>${fDate(a.delivery_deadline, lang)}</dd><dt>${t("opp_start")}</dt><dd>${fDT(a.start_time, lang)}</dd><dt>${t("opp_bond")}</dt><dd class="num">${money(a.bid_bond_amount)}</dd></dl>
      <div class="row between" style=${{ marginTop: "auto" }}>
        ${pq ? html`<${Status} s=${pq.status} />` : html`<span class="muted small">${t("my_status_none")}</span>`}
        ${!pq && a.status !== "LIVE" && a.status !== "SOFT_CLOSE" ? html`<button class="btn primary sm" onClick=${() => setApplyTo(a)}>${t("apply")}</button>` : null}
        ${pq?.status === "APPROVED" ? html`<button class="btn sm" onClick=${() => go("s-room", a.id)}>${t("enter_room")}</button>` : null}
      </div>
      ${pq?.status === "APPROVED" ? html`<div class="small muted">${t("my_label", { label: a.anon[cid] })}</div>` : null}
    <//>`; })}</div>` : html`<${Card}><div class="empty">${t("no_opps")}</div><//>`}
    ${applyTo ? html`<${ApplyModal} a=${applyTo} onClose=${() => setApplyTo(null)} />` : null}
  </div>`;
}
function ApplyModal({ a, onClose }) {
  const { t, user, toast } = useApp();
  const [step, setStep] = useState(1);
  const [docs, setDocs] = useState(["ISO 9001", "Commercial register"]);
  const [files, setFiles] = useState([]);
  const [terms, setTerms] = useState(false);
  const [pay, setPay] = useState({ state: "idle", ref: null });
  const all = ["ISO 9001", "Commercial register", "Tax card", "Datasheet", "OEM authorization", "Sample report"];
  const allDocs = docs.concat(files);
  const doPay = () => { setPay({ state: "busy" }); setTimeout(() => setPay({ state: "done", ref: gwRef() }), 1400); };
  const submit = () => { engine.apply(a.id, user.company_id, user.id, allDocs, pay.ref); emit(); toast(t("app_sent", { id: a.id }), "ok"); onClose(); };
  return html`<${Modal} title=${t("apply_title", { id: a.id })} onClose=${onClose}>
    <div class="row small muted"><${Pill} kind=${step === 1 ? "info" : "ok"}>1 · ${t("apply_docs")}<//><${Pill} kind=${step === 2 ? "info" : "neutral"}>2 · ${t("col_bond")}<//></div>
    ${step === 1 ? html`
      <p class="note" style=${{ margin: 0 }}>${t("apply_docs_hint")}</p>
      <div class="grid g2">${all.map((d) => html`<label class="check" key=${d}><input type="checkbox" checked=${docs.includes(d)} onChange=${(e) => setDocs(e.target.checked ? [...docs, d] : docs.filter((x) => x !== d))} />${d}</label>`)}</div>
      <div class="field"><label for="apply-files">${t("apply_files")}</label><input id="apply-files" type="file" multiple class="input" onChange=${(e) => setFiles([...e.target.files].map((f) => f.name))} /></div>
      <label class="check"><input type="checkbox" checked=${terms} onChange=${(e) => setTerms(e.target.checked)} /><span class="small">${t("apply_terms", { terms: a.penalty_terms })}</span></label>
      ${!allDocs.length ? html`<span class="small" style=${{ color: "var(--danger)" }}>${t("doc_required")}</span>` : null}
      <div class="row" style=${{ justifyContent: "flex-end" }}><button class="btn primary" disabled=${!terms || !allDocs.length} onClick=${() => (a.bid_bond_amount > 0 ? setStep(2) : submit())}>${a.bid_bond_amount > 0 ? t("apply_next") : t("submit_app")}</button></div>
    ` : html`
      <div><h3>${t("apply_pay_title")}</h3><p class="note">${t("apply_pay_sub", { amount: money(a.bid_bond_amount) })}</p></div>
      <div class="field"><label for="cc">${t("card_number")}</label><input id="cc" class="input mono" value="4242 4242 4242 4242" readOnly /></div>
      <div class="grid g2"><div class="field"><label for="cc-exp">${t("card_exp")}</label><input id="cc-exp" class="input mono" value="12 / 28" readOnly /></div><div class="field"><label for="cc-cvc">${t("card_cvc")}</label><input id="cc-cvc" class="input mono" value="•••" readOnly /></div></div>
      ${pay.state === "busy" ? html`<div class="row"><div class="spinner"></div><span class="muted">${t("paying")}</span></div>` : null}
      ${pay.state === "done" ? html`<${Callout} kind="ok" icon="check">${t("paid", { ref: pay.ref })}<//>` : null}
      <div class="row" style=${{ justifyContent: "space-between" }}><button class="btn ghost" onClick=${() => setStep(1)}>${t("back")}</button>
        ${pay.state !== "done" ? html`<button class="btn navy" disabled=${pay.state === "busy"} onClick=${doPay}><${Icon} n="card" />${t("pay_hold", { amount: money(a.bid_bond_amount) })}</button>` : html`<button class="btn primary" onClick=${submit}>${t("submit_app")}</button>`}</div>
    `}
  <//>`;
}
function Rooms() {
  const { t, user, go, lang } = useApp(); const cid = user.company_id;
  const rows = db.auctions.filter((a) => prequalOf(a.id, cid)?.status === "APPROVED").sort((x, y) => (isLive(y) - isLive(x)) || y.start_time - x.start_time);
  return html`<div class="page"><${PageHead} title=${t("rooms_title")} sub=${t("rooms_sub")} />
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_id")}</th><th>${t("col_title")}</th><th>${t("col_buyer")}</th><th>${t("col_label")}</th><th>${t("col_status")}</th><th>${t("col_start")}</th><th></th></tr></thead><tbody>
      ${rows.map((a) => html`<tr key=${a.id} class="click" onClick=${() => go("s-room", a.id)}><td class="num">${a.id}</td><td><b><bdi>${a.title}</bdi></b></td><td>${coName(a.buyer_company_id)}</td><td class="mono">${a.anon[cid]}</td><td><${Status} s=${a.status} /></td><td class="muted">${fDT(a.start_time, lang)}</td><td>${isLive(a) || a.status === "SCHEDULED" ? html`<button class=${"btn sm " + (isLive(a) ? "primary" : "")}>${t("enter_room")}</button>` : null}</td></tr>`)}
    </tbody></table></div></div>`;
}
function LiveRoom({ id }) {
  const { t, user, go, toast, lang } = useApp(); const cid = user.company_id;
  const a = auc(id);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);
  const [confirmBig, setConfirmBig] = useState(false);
  const [conn, setConn] = useState("online");
  const snap = useRef(null);
  const label = a.anon[cid];
  const now = clock.now();
  const liveLow = lowestBid(a.id);
  const myBids = bidsOf(a.id).filter((b) => b.supplier_company_id === cid).sort((x, y) => y.placed_at - x.placed_at);
  const view = conn === "online" ? { low: liveLow, end: a.end_time, status: a.status } : snap.current;
  const low = view.low; const remain = view.end - now;
  const max = low ? low.amount - a.min_decrement : a.budget_ceiling;
  const leading = low && low.supplier_company_id === cid;
  const latency = Math.round(38 + Math.sin(now / 2700) * 9 + Math.cos(now / 900) * 4);
  const drop = () => { snap.current = { low: liveLow, end: a.end_time, status: a.status }; setConn("offline"); setTimeout(() => setConn("reconnecting"), 2600); setTimeout(() => setConn("syncing"), 3800); setTimeout(() => { setConn("online"); toast(t("synced"), "ok"); }, 4600); };
  const place = (v) => {
    if (conn !== "online") { setMsg({ kind: "danger", text: t("err_offline") }); return; }
    const val = Number(v);
    if (low && val < low.amount * 0.95 && !confirmBig) { setConfirmBig(true); return; }
    setConfirmBig(false);
    const r = engine.placeBid(a.id, cid, user.id, val); emit();
    if (r.ok) { setMsg({ kind: "ok", text: t("bid_ok", { amount: money(val) }) }); setAmount(""); }
    else setMsg({ kind: "danger", text: t(r.err, r.params) });
  };
  const contract = contractsOf(a.id).filter((c) => c.winner_company_id === cid).pop();
  const r = ranking(a.id); const pos = r.findIndex((b) => b.supplier_company_id === cid);
  const live = isLive(a);
  const ready = live && conn === "online";
  const suggested = max;
  return html`<div class="page">
    <div><button class="btn ghost sm" onClick=${() => go("s-rooms")}><${Icon} n="back" cls="flip" />${t("back")}</button></div>
    <div class=${"room" + (live ? " is-live" : "")}>
      <div class="room-bar"><h2>${t("room_title", { title: a.title })}</h2>
        <div class="row">
          <span class=${"conn " + (conn === "online" ? "" : conn === "offline" ? "off" : "mid")}><i></i>${conn === "online" ? t("connected") + " · " + latency + " ms" : t(conn === "offline" ? "offline" : conn)}</span>
          <span class="conn">· ${t("anon_bidder", { label })}</span>
          ${live ? html`<button class="btn sm" style=${{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,.3)" }} disabled=${conn !== "online"} onClick=${drop}><${Icon} n="wifi" />${t("sim_drop")}</button>` : null}
        </div>
      </div>
      ${conn !== "online" ? html`<div class=${"offline-banner " + (conn === "offline" ? "" : "mid")}>${conn === "offline" ? html`<${Icon} n="warn" />` : html`<div class="spinner"></div>`}${t(conn === "offline" ? "offline" : conn)}</div>` : null}
      <div class="room-body">
        <div>
          ${a.status === "SCHEDULED" ? html`<div class="card timer-box"><div class="lbl">${t("room_wait")}</div><div class="timer">${dur(a.start_time - now)}</div><p class="muted" style=${{ margin: 0 }}>${t("not_live_yet")}</p></div>` : html`
          <div class="card timer-box" style=${{ boxShadow: "none", position: "relative" }}>${a.extensions && live ? html`<span key=${"x" + a.extensions} class="ext-float">+${a.extension_sec}s</span>` : null}
            <div class="lbl">${live ? t("time_remaining") : t("ended")}</div>
            <div key=${live && remain < 15 * SEC ? "k" + Math.ceil(remain / 1000) : "t"} class=${"timer" + (live && remain < 60 * SEC ? " urgent" : "") + (live && remain < 15 * SEC ? " tick" : "")}>${live ? dur(remain) : "00:00"}</div>
            ${view.status === "SOFT_CLOSE" && live ? html`<span class="softclose">${t("softclose_active", { e: "+" + dur(a.extension_sec * SEC) })}</span>` : null}
          </div>
          <div class="grid g2">
            <div class="card" style=${{ boxShadow: "none" }}><div class="kpi-label">${t("current_lowest")}</div><div key=${low ? low.id : 0} class="big-money good pricein">${low ? money(low.amount) : "—"}</div><div class="small muted">${low ? (leading ? t("by_you") : t("by_vendor", { label: low.anon_label })) : t("no_bids_yet")}</div></div>
            <div key=${"last-" + (leading ? "L" : low ? low.id : 0)} class=${"card" + (myBids[0] && !leading ? " shake" : "")} style=${{ boxShadow: "none", position: "relative" }}>${leading && myBids[0] ? html`<${Burst} key=${myBids[0].id} />` : null}<div class="kpi-label">${t("your_last")}</div><div class=${"big-money " + (myBids[0] ? (leading ? "good" : "bad") : "")}>${myBids[0] ? money(myBids[0].amount) : "—"}</div><div class="small muted">${!myBids[0] ? t("no_bid_yet") : leading ? t("leading") : t("outbid_msg", { amount: money(low.amount) })}</div></div>
          </div>`}
          ${live ? html`<form class="card" style=${{ boxShadow: "none" }} onSubmit=${(e) => { e.preventDefault(); place(amount || suggested); }}>
            <label class="kpi-label" for="bid-amt">${t("new_bid", { max: money(max), dec: money(a.min_decrement) })}</label>
            <div class="row" style=${{ marginTop: "8px" }}>
              <input id="bid-amt" class="input mono" style=${{ maxWidth: "190px", fontSize: "20px", fontWeight: 600 }} type="number" step="any" placeholder=${String(suggested)} value=${amount} disabled=${!ready || leading} onChange=${(e) => { setAmount(e.target.value); setConfirmBig(false); }} />
              <button class="btn primary lg" type="submit" disabled=${!ready || leading}>${t("place_bid")}</button>
            </div>
            <div class="quick" style=${{ marginTop: "10px" }}>${[1, 2, 5, 10].map((k) => html`<button type="button" key=${k} class="btn sm" disabled=${!ready || leading} onClick=${() => { setAmount(String((low ? low.amount : a.budget_ceiling + a.min_decrement) - a.min_decrement * k)); setConfirmBig(false); }}>−${money(a.min_decrement * k)}</button>`)}</div>
            ${confirmBig ? html`<div style=${{ marginTop: "10px" }}><${Callout} kind="warn" icon="warn">${t("big_jump", { p: pct(1 - Number(amount || suggested) / low.amount) })} <button type="submit" class="btn sm" style=${{ marginInlineStart: "6px" }}>${t("confirm_bid")}</button><//></div>` : null}
            ${msg ? html`<div style=${{ marginTop: "10px" }}><${Callout} kind=${msg.kind} icon=${msg.kind === "ok" ? "check" : "warn"}>${msg.text}<//></div>` : null}
          </form>` : null}
          ${!live && a.status !== "SCHEDULED" ? html`<${Callout} kind=${contract && contract.status !== "DEFAULTED" ? "ok" : "info"} icon="info">${a.status === "CLOSED" ? t("room_closed") : contract && contract.status !== "DEFAULTED" ? t("you_won") : pos === 1 && a.status === "AWARDED" ? t("you_runner") : pos >= 0 ? t("you_lost") : t("room_closed")}<//>` : null}
          ${a.status !== "SCHEDULED" ? html`<div class="card" style=${{ boxShadow: "none" }}><div class="kpi-label" style=${{ marginBottom: "6px" }}>${t("price_curve")}</div><${PriceChart} a=${a} mine=${cid} height=${190} /></div>` : null}
        </div>
        <div>
          <h2>${t("auction_details")}</h2>
          <div class="kv"><div>${t("d_quantity")}</div><div class="num">${a.quantity}</div><div>${t("d_budget")}</div><div class="num">${money(a.budget_ceiling)}</div><div>${t("opp_delivery")}</div><div>${fDate(a.delivery_deadline, lang)}</div><div>${t("d_min_dec")}</div><div class="num">${money(a.min_decrement)}</div><div>${t("d_softclose")}</div><div>${t("d_softclose_v", { w: a.soft_close_window_sec + "s", e: a.extension_sec + "s" })}</div><div>${t("d_specs")}</div><div class="small">${a.specifications}</div></div>
          <h2>${t("your_bids")}</h2>
          ${myBids.length ? html`<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_time")}</th><th class="r">${t("col_amount")}</th><th>${t("col_result")}</th></tr></thead><tbody>${myBids.map((b, i) => html`<tr key=${b.id}><td class="num">${fTime(b.placed_at)}</td><td class="r num">${money(b.amount)}</td><td>${i === 0 && leading ? html`<${Pill} kind="ok">${t(live ? "res_leading" : "res_final_win")}<//>` : html`<${Pill} kind="warn">${t("res_outbid")}<//>`}</td></tr>`)}</tbody></table></div>` : html`<p class="muted">${t("no_bid_yet")}</p>`}
          <p class="note">${t("blind_note")}</p>
        </div>
      </div>
    </div>
  </div>`;
}
function SupplierContracts() {
  const { t, user, toast, lang } = useApp();
  const [sign, setSign] = useState(null); const [decl, setDecl] = useState(null); const [ok, setOk] = useState(false);
  const rows = db.contracts.filter((c) => c.winner_company_id === user.company_id).sort((x, y) => y.awarded_at - x.awarded_at);
  return html`<div class="page"><${PageHead} title=${t("contracts_title")} sub=${t("s_contracts_sub")} />
    <${ContractsTable} rows=${rows} supplierView=${true} actions=${(c) => c.status === "PENDING_SIGN" ? html`<div class="row"><button class="btn primary sm" onClick=${() => { setOk(false); setSign(c); }}>${t("sign")}</button><button class="btn sm" onClick=${() => setDecl(c)}>${t("decline")}</button></div>` : "—"} />
    ${sign ? html`<${Modal} title=${t("sign_title", { id: sign.auction_id })} onClose=${() => setSign(null)}>
      <div class="kv"><div>${t("col_auction")}</div><div><bdi>${auc(sign.auction_id).title}</bdi></div><div>${t("col_buyer")}</div><div>${coName(auc(sign.auction_id).buyer_company_id)}</div><div>${t("col_price")}</div><div class="num"><b>${money(sign.final_price)}</b></div><div>${t("d_delivery")}</div><div>${fDate(auc(sign.auction_id).delivery_deadline, lang)}</div><div>${t("penalty_terms")}</div><div class="small">${sign.penalty_terms}</div></div>
      <label class="check"><input type="checkbox" checked=${ok} onChange=${(e) => setOk(e.target.checked)} />${t("sign_accept", { price: money(sign.final_price) })}</label>
      <div class="row" style=${{ justifyContent: "flex-end" }}><button class="btn primary" disabled=${!ok} onClick=${() => { engine.sign(sign, user.id); emit(); setSign(null); toast(t("signed_ok"), "ok"); }}>${t("sign")}</button></div>
    <//>` : null}
    ${decl ? html`<${Modal} title=${t("decline_title", { id: decl.auction_id })} onClose=${() => setDecl(null)}>
      <${Callout} kind="danger" icon="warn">${t("decline_warn", { bond: money(depositOf(decl.auction_id, user.company_id)?.amount || 0) })}<//>
      <div class="row" style=${{ justifyContent: "flex-end" }}><button class="btn" onClick=${() => setDecl(null)}>${t("back")}</button><button class="btn danger" onClick=${() => { engine.defaultAndFailover(decl, user.full_name); emit(); setDecl(null); }}>${t("confirm_decline")}</button></div>
    <//>` : null}
  </div>`;
}

/* ============================================================
   Admin views
   ============================================================ */
function AdminDashboard() {
  const { t, go, lang } = useApp();
  const verified = db.companies.filter((c) => c.verification_status === "VERIFIED").length;
  const pending = db.companies.filter((c) => c.verification_status === "PENDING");
  const live = db.auctions.filter(isLive);
  const held = db.deposits.filter((d) => d.status === "HELD").reduce((s, d) => s + d.amount, 0);
  const done = db.contracts.filter((c) => c.status === "COMPLETED");
  const gmv = done.reduce((s, c) => s + c.final_price, 0);
  const months = monthBuckets(lang); for (const c of done) { const m = months.find((m) => c.completed_at >= m.from && c.completed_at < m.to); if (m) m.value += c.final_price; }
  return html`<div class="page">
    <${PageHead} title=${t("a_dash_title")} sub=${t("a_dash_sub")} />
    <div class="grid g4">
      <${Kpi} label=${t("k_verified")} num=${verified} />
      <${Kpi} label=${t("k_pending_verif")} value=${pending.length} tone=${pending.length ? "bad" : ""} />
      <${Kpi} label=${t("k_held")} num=${held} fmt=${money} sub=${t("k_live_n", { n: live.length })} />
      <${Kpi} label=${t("k_gmv")} num=${gmv} fmt=${(v) => money(v, true)} tone="good" />
    </div>
    <div class="grid g-main">
      <${Card} title=${t("gmv_by_month")}><${BarChart} data=${months} hlLast=${true} /><//>
      <${Card} title=${t("k_pending_verif")} right=${html`<button class="btn sm" onClick=${() => go("a-verify")}>${t("open")}</button>`}>
        ${pending.length ? pending.map((c) => html`<div class="list-item" key=${c.id}><div class="avatar" style=${{ background: "var(--warn-bg)", color: "var(--warn)" }}>${initials(c.name)}</div><div class="grow"><b>${c.name}</b><div class="small muted">${t("role_" + c.company_type)} · ${c.country} · ${t("registered", { t: rel(c.created_at, lang) })}</div></div></div>`) : html`<p class="muted">${t("all_verified")}</p>`}
      <//>
    </div>
    <div class="grid g2">
      <${Card} title=${t("live_now")} right=${html`<button class="btn sm" onClick=${() => go("a-live")}>${t("open")}</button>`}>
        ${live.length ? live.map((a) => { const low = lowestBid(a.id); return html`<div class="list-item" key=${a.id}><div class="grow"><div class="ellipsis"><b>#${a.id}</b> <bdi>${a.title}</bdi></div><div class="small muted">${coName(a.buyer_company_id)} · ${t("bids_n", { n: bidsOf(a.id).length })} · ${t("extensions")}: ${a.extensions}</div></div><b class="mono">${low ? money(low.amount) : "—"}</b><span class="mono muted">${dur(a.end_time - clock.now())}</span></div>`; }) : html`<p class="muted">${t("no_live")}</p>`}
      <//>
      <${Card} title=${t("recent_audit")} right=${html`<button class="btn sm" onClick=${() => go("a-audit")}>${t("open")}</button>`}>
        ${db.audit.slice(0, 7).map((e) => html`<div class="list-item" key=${e.id}><div class="grow"><div class="small"><b>${e.action}</b> · ${e.details}</div><div class="small muted">${e.actor} · ${rel(e.at, lang)}</div></div></div>`)}
      <//>
    </div>
  </div>`;
}
function Verification() {
  const { t, user, lang, toast } = useApp();
  const pending = db.companies.filter((c) => c.verification_status === "PENDING");
  const others = db.companies.filter((c) => c.verification_status !== "PENDING").sort((x, y) => y.created_at - x.created_at);
  return html`<div class="page"><${PageHead} title=${t("verif_title")} sub=${t("verif_sub")} />
    ${pending.length ? html`<div class="grid g2">${pending.map((c) => html`<${Card} key=${c.id}>
      <div class="row" style=${{ marginBottom: "12px" }}><div class="avatar">${initials(c.name)}</div><div class="grow"><h3>${c.name}</h3><div class="small muted">${t("registered", { t: rel(c.created_at, lang) })}</div></div><${Status} s="PENDING" /></div>
      <div class="kv"><div>${t("col_type")}</div><div>${t("role_" + c.company_type)}</div><div>${t("col_tax")}</div><div class="mono">${c.tax_id}</div><div>${t("col_country")}</div><div>${c.country}</div><div>${t("docs")}</div><div>${c.docs.join(", ") || "—"}</div><div>${t("col_email")}</div><div>${db.users.filter((u) => u.company_id === c.id).map((u) => u.email).join(", ")}</div></div>
      <div class="row" style=${{ marginTop: "14px", justifyContent: "flex-end" }}><button class="btn danger sm" onClick=${() => { engine.verify(c.id, user.id, false); emit(); }}>${t("reject")}</button><button class="btn primary sm" onClick=${() => { engine.verify(c.id, user.id, true); emit(); toast(t("st_VERIFIED") + ": " + c.name, "ok"); }}><${Icon} n="shield" />${t("verify")}</button></div>
    <//>`)}</div>` : html`<${Card}><div class="empty">${t("all_verified")}</div><//>`}
    <h2>${t("history")}</h2>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_company")}</th><th>${t("col_type")}</th><th>${t("col_tax")}</th><th>${t("col_country")}</th><th>${t("col_status")}</th><th>${t("col_created")}</th></tr></thead><tbody>
      ${others.map((c) => html`<tr key=${c.id}><td><b>${c.name}</b></td><td>${t("role_" + c.company_type)}</td><td class="mono">${c.tax_id}</td><td>${c.country}</td><td><${Status} s=${c.verification_status} /></td><td class="muted">${fDate(c.created_at, lang)}</td></tr>`)}
    </tbody></table></div></div>`;
}
function LiveMonitor() {
  const { t, go } = useApp();
  const live = db.auctions.filter(isLive); const soon = db.auctions.filter((a) => a.status === "SCHEDULED");
  return html`<div class="page"><${PageHead} title=${t("live_title")} sub=${t("live_sub")} />
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_id")}</th><th>${t("col_title")}</th><th>${t("col_buyer")}</th><th>${t("col_status")}</th><th class="r">${t("col_participants")}</th><th class="r">${t("col_bids")}</th><th class="r">${t("col_extensions")}</th><th class="r">${t("lowest")}</th><th class="r">${t("time_remaining")}</th></tr></thead><tbody>
      ${live.concat(soon).map((a) => { const low = lowestBid(a.id); return html`<tr key=${a.id} class="click" onClick=${() => go("a-auction", a.id)}><td class="num">${a.id}</td><td><b><bdi>${a.title}</bdi></b></td><td>${coName(a.buyer_company_id)}</td><td><${Status} s=${a.status} /></td><td class="r num">${approvedOf(a.id).length}</td><td class="r num">${bidsOf(a.id).length}</td><td class="r num">${a.extensions}</td><td class="r num">${low ? money(low.amount) : "—"}</td><td class="r num">${isLive(a) ? dur(a.end_time - clock.now()) : "+" + dur(a.start_time - clock.now())}</td></tr>`; })}
      ${!live.length && !soon.length ? html`<tr><td colspan="9" class="empty">${t("no_live")}</td></tr>` : null}
    </tbody></table></div>
    <h2>${t("all_auctions")}</h2>
    <${AuctionsTable} rows=${db.auctions.slice().sort((x, y) => y.id - x.id)} onOpen=${(a) => go("a-auction", a.id)} showBuyer=${true} />
  </div>`;
}
function Payments() {
  const { t, lang } = useApp(); const [f, setF] = useState("ALL");
  const rows = db.deposits.slice().sort((x, y) => y.created_at - x.created_at).filter((d) => f === "ALL" || d.status === f);
  const sum = (s) => db.deposits.filter((d) => d.status === s).reduce((a, d) => a + d.amount, 0);
  return html`<div class="page"><${PageHead} title=${t("pay_title")} sub=${t("pay_sub")} />
    <div class="grid g3"><${Kpi} label=${t("st_HELD")} value=${money(sum("HELD"))} /><${Kpi} label=${t("st_RELEASED")} value=${money(sum("RELEASED"))} /><${Kpi} label=${t("st_FORFEITED")} value=${money(sum("FORFEITED"))} tone=${sum("FORFEITED") ? "bad" : ""} /></div>
    <div class="seg">${["ALL", "HELD", "RELEASED", "FORFEITED"].map((s) => html`<button key=${s} class=${f === s ? "on" : ""} onClick=${() => setF(s)}>${s === "ALL" ? t("f_all") : t("st_" + s)}</button>`)}</div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_ref")}</th><th>${t("col_auction")}</th><th>${t("col_supplier")}</th><th class="r">${t("col_amount")}</th><th>${t("col_status")}</th><th>${t("col_created")}</th></tr></thead><tbody>
      ${rows.map((d) => html`<tr key=${d.id}><td class="mono small">${d.gateway_ref}</td><td><b>#${d.auction_id}</b> <span class="muted"><bdi>${auc(d.auction_id).title}</bdi></span></td><td>${coName(d.supplier_company_id)}</td><td class="r num">${money(d.amount)}</td><td><${Status} s=${d.status} /></td><td class="muted">${fDT(d.created_at, lang)}</td></tr>`)}
    </tbody></table></div></div>`;
}
function Users() {
  const { t, user } = useApp();
  return html`<div class="page"><${PageHead} title=${t("users_title")} sub=${t("users_sub")} />
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_name")}</th><th>${t("col_email")}</th><th>${t("col_role")}</th><th>${t("col_company")}</th><th>${t("col_status")}</th><th>${t("col_action")}</th></tr></thead><tbody>
      ${db.users.map((u) => html`<tr key=${u.id}><td><div class="row"><div class="avatar" style=${{ width: "28px", height: "28px", fontSize: "11px" }}>${initials(u.full_name)}</div><b>${u.full_name}</b></div></td><td class="mono small">${u.email}</td><td>${t("role_" + u.role)}</td><td>${u.company_id ? coName(u.company_id) : "Wardly"}</td><td>${u.is_active ? html`<${Pill} kind="ok">${t("col_active")}<//>` : html`<${Pill} kind="neutral">—<//>`}</td><td>${u.id !== user.id ? html`<button class="btn sm" onClick=${() => { u.is_active = !u.is_active; audit(user.full_name, u.is_active ? "USER_ACTIVATED" : "USER_DEACTIVATED", u.email); emit(); }}>${u.is_active ? t("deactivate") : t("activate")}</button>` : "—"}</td></tr>`)}
    </tbody></table></div></div>`;
}
function AuditLog() {
  const { t, lang } = useApp(); const [q, setQ] = useState("");
  const rows = db.audit.filter((e) => !q || (e.actor + " " + e.action + " " + e.details).toLowerCase().includes(q.toLowerCase())).slice(0, 200);
  return html`<div class="page"><${PageHead} title=${t("audit_title")} sub=${t("audit_sub")} right=${html`<input class="input" style=${{ width: "240px" }} placeholder=${t("search")} value=${q} onChange=${(e) => setQ(e.target.value)} aria-label=${t("search")} />`} />
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("col_time")}</th><th>${t("col_actor")}</th><th>${t("col_event")}</th><th>${t("col_details")}</th></tr></thead><tbody>
      ${rows.map((e) => html`<tr key=${e.id}><td class="num small muted" style=${{ whiteSpace: "nowrap" }}>${fDT(e.at, lang)} · ${fTime(e.at)}</td><td>${e.actor}</td><td><span class="mono small"><b>${e.action}</b></span></td><td class="small">${e.details}</td></tr>`)}
    </tbody></table></div></div>`;
}

/* ============================================================
   Login & register
   ============================================================ */
function NetCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext("2d"); let raf; const reduce = REDUCE;
    const pts = Array.from({ length: 34 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0006, vy: (Math.random() - 0.5) * 0.0006 }));
    const draw = () => {
      const w = (c.width = c.clientWidth * devicePixelRatio), h = (c.height = c.clientHeight * devicePixelRatio);
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) { if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > 1) p.vx *= -1; if (p.y < 0 || p.y > 1) p.vy *= -1; } }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const a = pts[i], b = pts[j]; const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h); if (d < 160 * devicePixelRatio) { ctx.strokeStyle = `rgba(126,226,168,${0.35 * (1 - d / (160 * devicePixelRatio))})`; ctx.lineWidth = devicePixelRatio; ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); } }
      for (const p of pts) { ctx.fillStyle = "rgba(126,226,168,.8)"; ctx.beginPath(); ctx.arc(p.x * w, p.y * h, 2 * devicePixelRatio, 0, 7); ctx.fill(); }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(raf);
  }, []);
  return html`<canvas ref=${ref}></canvas>`;
}
function LoginLive() {
  const [st, setSt] = useState({ p: 46800, t: 134, rows: [{ k: 1, l: "Vendor #3", v: 46800 }, { k: 0, l: "Vendor #5", v: 47250 }] });
  useEffect(() => {
    const tk = setInterval(() => setSt((s) => ({ ...s, t: s.t > 1 ? s.t - 1 : 180 })), 1000);
    const id = setInterval(() => setSt((s) => { let v = s.p - 50 * Math.ceil(Math.random() * 6); if (v < 44200) v = 49500; return { ...s, p: v, t: s.t < 120 ? s.t + 60 : s.t, rows: [{ k: s.rows[0].k + 1, l: "Vendor #" + pick([2, 3, 5, 7, 9, 11]), v }, ...s.rows].slice(0, 3) }; }), 2600);
    return () => { clearInterval(id); clearInterval(tk); };
  }, []);
  return html`<div class="login-live" aria-hidden="true">
    <div class="row between"><span class="ll-tag"><i></i>LIVE · 100 Laptops - Core i7</span><span class="mono ll-t">${dur(st.t * 1000)}</span></div>
    <div class="ll-price">$<${AnimNum} value=${st.p} start=${st.p} ms=${700} /></div>
    ${st.rows.map((r) => html`<div class="ll-row" key=${r.k}><span>${r.l}</span><span class="mono">${money(r.v)}</span></div>`)}
  </div>`;
}
function Login({ onLogin, tools }) {
  const { t } = useApp();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("procurement@acme-corp.com"); const [pw, setPw] = useState("demo1234"); const [err, setErr] = useState("");
  const [reg, setReg] = useState({ name: "", type: "SUPPLIER", tax: "", country: "Egypt", person: "", email: "", docs: ["Commercial register", "Tax card"] });
  const [regDone, setRegDone] = useState(null);
  const tryLogin = (em) => {
    const u = db.users.find((u) => u.email === em.trim().toLowerCase() && u.is_active);
    if (!u) return setErr(t("login_err"));
    if (u.company_id) { const c = co(u.company_id); if (c.verification_status === "PENDING") return setErr(t("login_pending")); if (c.verification_status === "REJECTED") return setErr(t("login_rejected")); }
    onLogin(u.id);
  };
  const demo = [[1, "BUYER"], [2, "SUPPLIER"], [3, "ADMIN"]];
  const submitReg = (e) => { e.preventDefault(); setErr(""); if (!reg.name.trim() || !reg.tax.trim() || !reg.person.trim() || !reg.email.trim()) return setErr(t("reg_err_req")); if (db.users.some((u) => u.email === reg.email.trim().toLowerCase())) return setErr(t("reg_err_email")); engine.register(reg); emit(); setRegDone(reg.name.trim()); };
  return html`<div class="login">
    <div class="login-side"><div class="blob b1"></div><div class="blob b2"></div><${NetCanvas} />
      <div class="brand" style=${{ padding: 0 }}><div class="brand-mark">W</div></div>
      <h1>Wardly</h1><div class="tag">${t("app_tag")}</div>
      <ul><li>✓ ${t("feat1")}</li><li>✓ ${t("feat2")}</li><li>✓ ${t("feat3")}</li><li>✓ ${t("feat4")}</li></ul><${LoginLive} />
    </div>
    <div class="login-main" style=${{ position: "relative" }}>
      <div class="login-tools">${tools}</div>
      ${mode === "login" ? html`<form class="login-form" onSubmit=${(e) => { e.preventDefault(); tryLogin(email); }}>
        <h1>${t("login_title")}</h1>
        <div class="small muted">${t("login_demo")}</div>
        ${demo.map(([id, role]) => { const u = usr(id); return html`<button type="button" class="demo-acc" key=${id} onClick=${(e) => onLogin(id, e)}><div class="avatar" style=${{ background: role === "BUYER" ? "#14924A" : role === "SUPPLIER" ? "#1F4FBF" : "#0B2A5B" }}>${initials(u.full_name)}</div><div class="grow"><b>${t("role_" + role)}</b> · ${u.full_name}<div class="small muted">${u.company_id ? coName(u.company_id) : "Wardly"} · ${u.email}</div></div><${Icon} n="next" cls="flip" /></button>`; })}
        <div class="small muted" style=${{ marginTop: "6px" }}>${t("login_or")}</div>
        <div class="field"><label for="em">${t("login_email")}</label><input id="em" class="input" type="email" value=${email} onChange=${(e) => setEmail(e.target.value)} /></div>
        <div class="field"><label for="pw">${t("login_password")}</label><input id="pw" class="input" type="password" value=${pw} onChange=${(e) => setPw(e.target.value)} /></div>
        ${err ? html`<span class="small" style=${{ color: "var(--danger)" }}>${err}</span>` : null}
        <div class="row"><button class="btn navy" type="submit">${t("login_btn")}</button><button type="button" class="btn ghost small" onClick=${() => { setErr(""); setMode("reg"); }}>${t("login_new")}</button></div>
      </form>` : html`<form class="login-form" onSubmit=${submitReg}>
        <h1>${t("reg_title")}</h1>
        ${regDone ? html`<${Callout} kind="ok" icon="check">${t("reg_done", { name: regDone })}<//><button type="button" class="btn" onClick=${() => { setMode("login"); setRegDone(null); }}>${t("reg_back")}</button>` : html`
        <div class="field"><label for="r-name">${t("reg_name")}</label><input id="r-name" class="input" value=${reg.name} onChange=${(e) => setReg({ ...reg, name: e.target.value })} /></div>
        <div class="grid g2"><div class="field"><label for="r-type">${t("reg_type")}</label><select id="r-type" class="input" value=${reg.type} onChange=${(e) => setReg({ ...reg, type: e.target.value })}><option value="SUPPLIER">${t("role_SUPPLIER")}</option><option value="BUYER">${t("role_BUYER")}</option></select></div>
        <div class="field"><label for="r-country">${t("reg_country")}</label><input id="r-country" class="input" value=${reg.country} onChange=${(e) => setReg({ ...reg, country: e.target.value })} /></div></div>
        <div class="field"><label for="r-tax">${t("reg_tax")}</label><input id="r-tax" class="input mono" placeholder="EG-000-000-000" value=${reg.tax} onChange=${(e) => setReg({ ...reg, tax: e.target.value })} /></div>
        <div class="grid g2"><div class="field"><label for="r-person">${t("reg_person")}</label><input id="r-person" class="input" value=${reg.person} onChange=${(e) => setReg({ ...reg, person: e.target.value })} /></div>
        <div class="field"><label for="r-email">${t("reg_email")}</label><input id="r-email" class="input" type="email" value=${reg.email} onChange=${(e) => setReg({ ...reg, email: e.target.value })} /></div></div>
        <div class="field"><label>${t("reg_docs")}</label><div class="row">${["Commercial register", "Tax card", "ISO 9001"].map((d) => html`<label class="check" key=${d}><input type="checkbox" checked=${reg.docs.includes(d)} onChange=${(e) => setReg({ ...reg, docs: e.target.checked ? [...reg.docs, d] : reg.docs.filter((x) => x !== d) })} />${d}</label>`)}</div></div>
        ${err ? html`<span class="small" style=${{ color: "var(--danger)" }}>${err}</span>` : null}
        <div class="row"><button class="btn primary" type="submit">${t("reg_submit")}</button><button type="button" class="btn ghost" onClick=${() => { setErr(""); setMode("login"); }}>${t("reg_back")}</button></div>`}
      </form>`}
    </div>
  </div>`;
}

/* ============================================================
   Shell
   ============================================================ */
const NAV = {
  BUYER: [["b-dash", "nav_dashboard", "dash"], ["b-auctions", "nav_my_auctions", "list"], ["b-create", "nav_create", "plus"], ["b-suppliers", "nav_suppliers", "users"], ["b-contracts", "nav_contracts", "file"]],
  SUPPLIER: [["s-dash", "nav_dashboard", "dash"], ["s-opps", "nav_opportunities", "search"], ["s-rooms", "nav_rooms", "room"], ["s-contracts", "nav_contracts", "file"]],
  ADMIN: [["a-dash", "nav_overview", "dash"], ["a-verify", "nav_verification", "shield"], ["a-live", "nav_live_monitor", "bolt"], ["a-pay", "nav_payments", "card"], ["a-users", "nav_users", "users"], ["a-audit", "nav_audit", "clock"]],
};
const HOME = { BUYER: "b-dash", SUPPLIER: "s-dash", ADMIN: "a-dash" };
const PARENT = { "b-auction": "b-auctions", "s-room": "s-rooms", "a-auction": "a-live" };
function navBadge(key, user) {
  if (key === "a-verify") return db.companies.filter((c) => c.verification_status === "PENDING").length;
  if (key === "s-contracts") return db.contracts.filter((c) => c.winner_company_id === user.company_id && c.status === "PENDING_SIGN").length;
  if (key === "s-rooms") return db.auctions.filter((a) => isLive(a) && prequalOf(a.id, user.company_id)?.status === "APPROVED").length;
  if (key === "b-auctions") return db.auctions.filter((a) => a.buyer_company_id === user.company_id && a.status === "CLOSED").length;
  return 0;
}
function Bell() {
  const { t, user, go, lang } = useApp(); const [open, setOpen] = useState(false); const ref = useRef(null);
  useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);
  const list = db.notifications.filter((n) => n.user_id === user.id).sort((x, y) => y.id - x.id).slice(0, 40);
  const unread = list.filter((n) => !n.is_read).length;
  const openN = (n) => { n.is_read = true; emit(); setOpen(false); if (!n.auction_id) { if (user.role === "ADMIN") go("a-verify"); return; } const a = auc(n.auction_id); if (user.role === "BUYER") go("b-auction", a.id); else if (user.role === "ADMIN") go("a-auction", a.id); else if (["awarded_you", "failover_you"].includes(n.type)) go("s-contracts"); else if (["invited", "prequal_rejected"].includes(n.type)) go("s-opps"); else go("s-room", a.id); };
  return html`<div style=${{ position: "relative" }} ref=${ref}>
    <button class="icon-btn" aria-label=${t("notifications")} onClick=${() => setOpen(!open)}><${Icon} n="bell" />${unread ? html`<span class="badge">${unread > 9 ? "9+" : unread}</span>` : null}</button>
    ${open ? html`<div class="drop"><div class="drop-head"><b>${t("notifications")}</b><button class="btn ghost sm" onClick=${() => { list.forEach((n) => (n.is_read = true)); emit(); }}>${t("mark_all")}</button></div>
      <div class="drop-list">${list.length ? list.map((n) => html`<button key=${n.id} class=${"notif" + (n.is_read ? "" : " unread")} onClick=${() => openN(n)}><div>${t("n_" + n.type, n.params)}</div><div class="when">${rel(n.created_at, lang)}</div></button>`) : html`<div class="empty">${t("no_notifs")}</div>`}</div></div>` : null}
  </div>`;
}
function SimPanel() {
  const { t } = useApp(); const [open, setOpen] = useState(false);
  return html`<div class="sim">
    ${open ? html`<div class="sim-panel">
      <div class="row between"><h3>${t("sim_title")}</h3><button class="icon-btn" onClick=${() => setOpen(false)} aria-label="Close"><${Icon} n="x" /></button></div>
      <div class="field"><label>${t("sim_speed")}</label><div class="seg">${[1, 5, 20].map((s) => html`<button key=${s} class=${clock.speed === s ? "on" : ""} onClick=${() => { clock.setSpeed(s); emit(); }}>${s}×</button>`)}</div></div>
      <label class="check"><input type="checkbox" checked=${!REDUCE} onChange=${(e) => setMotion(e.target.checked)} />${t("sim_motion")}</label>
      <label class="check"><input type="checkbox" checked=${db.settings.bots} onChange=${(e) => { db.settings.bots = e.target.checked; emit(); }} />${t("sim_bots")}</label>
      <div class="small muted">${t("sim_clock")}: <span class="mono">${fTime(clock.now())}</span></div>
      <p class="note" style=${{ margin: 0 }}>${t("sim_note")}</p>
      <button class="btn sm" onClick=${() => { seed(); emit(); }}>${t("sim_reset")}</button>
    </div>` : null}
    <button class="btn navy sim-fab" onClick=${() => setOpen(!open)}><${Icon} n="sliders" />${t("sim_title")}${clock.speed > 1 ? html` <span class="pill pill-warn">${clock.speed}×</span>` : null}</button>
  </div>`;
}
function Toast({ x, onDone }) {
  const { t } = useApp(); const [out, setOut] = useState(false);
  const close = () => { setOut(true); setTimeout(onDone, REDUCE ? 0 : 280); };
  useEffect(() => { const id = setTimeout(close, 5200); return () => clearTimeout(id); }, []);
  const text = x.text || t("n_" + x.type, x.params);
  const kind = x.kind || (["outbid", "contract_defaulted", "prequal_rejected", "auction_expired", "cancelled"].includes(x.type) ? "warn" : ["awarded_you", "failover_you", "prequal_approved", "contract_signed", "delivered", "auction_closed"].includes(x.type) ? "ok" : "");
  return html`<div class=${"toast " + kind + (out ? " out" : "")} role="status"><span class="tbar"></span><${Icon} n=${kind === "warn" || kind === "err" ? "warn" : kind === "ok" ? "check" : "bell"} /><div style=${{ flex: 1 }}>${text}</div><button class="icon-btn" style=${{ width: "22px", height: "22px" }} onClick=${close} aria-label="Dismiss"><${Icon} n="x" /></button></div>`;
}

const LOGO = (cls) => html`<svg class=${cls} viewBox="0 0 96 96" aria-hidden="true"><rect x="4" y="4" width="88" height="88" rx="24" pathLength="1" /><polyline points="24,32 36,66 48,42 60,66 72,32" pathLength="1" /></svg>`;
function Splash({ onReveal, onDone }) {
  const [out, setOut] = useState(false); const [price, setPrice] = useState(50000); const done = useRef(false);
  const finish = () => { if (done.current) return; done.current = true; setOut(true); onReveal(); setTimeout(onDone, REDUCE ? 0 : 850); };
  useEffect(() => { const a = setTimeout(() => setPrice(46100), 1550); const b = setTimeout(finish, REDUCE ? 500 : 3400); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return html`<div class=${"splash" + (out ? " out" : "")} onClick=${finish} role="presentation">
    <div class="glow g1"></div><div class="glow g2"></div><div class="gridbg"></div>
    <div class="splash-inner">
      ${LOGO("splash-logo")}
      <div class="word" aria-label="Wardly">${"WARDLY".split("").map((c, i) => html`<span key=${i} style=${{ "--i": i }}>${c}</span>`)}</div>
      <div class="stag">B2B Reverse Auctions · مزادات عكسية</div>
      <div class="splash-ticker"><span class="lbl"><i></i>LIVE · LOWEST BID</span><span class="p">$<${AnimNum} value=${price} start=${50000} ms=${1500} /></span><svg width="96" height="30" viewBox="0 0 96 30"><polyline pathLength="1" points="2,4 16,6 28,11 42,12 54,17 66,19 80,24 94,26" /></svg></div>
      <div class="splash-load"><span></span></div>
    </div>
    <div class="skip">click to skip · اضغط للتخطي</div>
  </div>`;
}
function Wipe({ x, y }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    el.animate([{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${r}px at ${x}px ${y}px)` }], { duration: 560, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" });
    const id = setTimeout(() => el.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.04)" }], { duration: 650, easing: "ease", fill: "forwards" }), 640);
    return () => clearTimeout(id);
  }, []);
  return html`<div class="wipe" ref=${ref}>${LOGO("")}</div>`;
}
document.addEventListener("pointerdown", (e) => {
  if (REDUCE) return;
  const b = e.target.closest && e.target.closest(".btn, .demo-acc, .nav button, .seg button");
  if (!b || b.disabled) return;
  const r = b.getBoundingClientRect(); const d = Math.max(r.width, r.height) * 2.2;
  const sp = document.createElement("span"); sp.className = "ripple";
  sp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  if (getComputedStyle(b).position === "static") b.style.position = "relative";
  b.style.overflow = "hidden"; b.appendChild(sp); setTimeout(() => sp.remove(), 700);
}, true);
/* cursor spotlight + 3D tilt */
let tiltEl = null;
const resetTilt = () => { if (tiltEl) { tiltEl.style.transform = ""; tiltEl = null; } };
document.addEventListener("pointermove", (e) => {
  if (REDUCE || e.pointerType !== "mouse" || !e.target.closest) return;
  const card = e.target.closest(".card, .kpi, .mini-live, .demo-acc");
  if (card) { const r = card.getBoundingClientRect(); card.style.setProperty("--mx", e.clientX - r.left + "px"); card.style.setProperty("--my", e.clientY - r.top + "px"); }
  const t = e.target.closest(".kpi, .mini-live, .card.opp, .demo-acc");
  if (tiltEl && tiltEl !== t) resetTilt();
  if (t) { const r = t.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; t.style.transform = `perspective(800px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg) translateY(-4px) scale(1.01)`; tiltEl = t; }
}, { passive: true });
document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) resetTilt(); });
function App() {
  const [, force] = useState(0);
  useEffect(() => { const h = () => force((x) => x + 1); listeners.add(h); const id = setInterval(() => { engine.tick(); emit(); }, 250); return () => { listeners.delete(h); clearInterval(id); }; }, []);
  const [lang, setLang] = useState("en");
  const initialTheme = () => document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const [theme, setTheme] = useState(initialTheme);
  const [uid, setUid] = useState(null);
  const [view, setView] = useState({ name: null, id: null });
  const [toasts, setToasts] = useState([]);
  const [splash, setSplash] = useState("show");
  const [wipe, setWipe] = useState(null);
  const [navKey, setNavKey] = useState(0);
  const lastN = useRef(0);
  const contentRef = useRef(null);
  const navRef = useRef(null);
  const navInd = useIndicator(navRef);
  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"; }, [lang]);
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  const t = useMemo(() => makeT(lang), [lang]);
  const user = uid ? usr(uid) : null;
  if (uid && !user) { setTimeout(() => setUid(null)); }
  useEffect(() => {
    if (!user) return;
    const fresh = db.notifications.filter((n) => n.user_id === user.id && n.id > lastN.current);
    if (fresh.length) { lastN.current = Math.max(...fresh.map((n) => n.id)); setToasts((ts) => [...ts, ...fresh.slice(-3).map((n) => ({ ...n, tid: Math.random() }))].slice(-4)); }
  });
  const doLogin = (id) => { lastN.current = db.notifications.reduce((m, n) => Math.max(m, n.id), 0); setUid(id); setView({ name: HOME[usr(id).role], id: null }); setToasts([]); };
  const withWipe = (e, fn) => { if (REDUCE) return fn(); const x = e && e.clientX ? e.clientX : innerWidth / 2, y = e && e.clientY ? e.clientY : innerHeight / 2; setWipe({ x, y, k: Math.random() }); setTimeout(fn, 560); setTimeout(() => setWipe(null), 1300); };
  const login = (id, e) => withWipe(e, () => doLogin(id));
  const logout = (e) => withWipe(e, () => setUid(null));
  const vt = (cls, fn) => { if (REDUCE || !document.startViewTransition) { fn(); return null; } const root = document.documentElement; root.classList.add(cls); const tr = document.startViewTransition(() => ReactDOM.flushSync(fn)); tr.finished.finally(() => root.classList.remove(cls)); return tr; };
  const toggleTheme = (e) => {
    const next = theme === "dark" ? "light" : "dark"; const x = e.clientX || innerWidth - 40, y = e.clientY || 30;
    const tr = vt("vt-theme", () => { setTheme(next); document.documentElement.setAttribute("data-theme", next); });
    if (tr) tr.ready.then(() => { const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)); document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }); }).catch(() => {});
  };
  const toggleLang = () => { const next = lang === "en" ? "ar" : "en"; vt("vt-lang", () => { setLang(next); document.documentElement.lang = next; document.documentElement.dir = next === "ar" ? "rtl" : "ltr"; }); };
  const [leaving, setLeaving] = useState(false);
  const go = (name, id = null) => {
    const apply = () => { setView({ name, id }); setLeaving(false); if (contentRef.current) contentRef.current.scrollTop = 0; };
    setNavKey((k) => k + 1);
    if (REDUCE) return apply();
    setLeaving(true); setTimeout(apply, 220);
  };
  const toast = (text, kind) => setToasts((ts) => [...ts, { text, kind, tid: Math.random() }].slice(-4));
  const ctx = { t, lang, user, go, toast };
  const tools = html`<button class="btn ghost sm" onClick=${toggleLang}><${Icon} n="globe" />${t("language")}</button><button class="icon-btn" aria-label=${t("theme")} onClick=${toggleTheme}><${Icon} n=${theme === "dark" ? "sun" : "moon"} /></button>`;
  let body;
  if (!user) body = html`<${Login} onLogin=${login} tools=${tools} />`;
  else {
    const v = view.name;
    const page = {
      "b-dash": () => html`<${BuyerDashboard} />`, "b-auctions": () => html`<${MyAuctions} />`, "b-create": () => html`<${CreateAuction} />`, "b-suppliers": () => html`<${Suppliers} />`, "b-contracts": () => html`<${BuyerContracts} />`, "b-auction": () => html`<${AuctionDetail} key=${view.id} id=${view.id} />`,
      "s-dash": () => html`<${SupplierDashboard} />`, "s-opps": () => html`<${Opportunities} />`, "s-rooms": () => html`<${Rooms} />`, "s-contracts": () => html`<${SupplierContracts} />`, "s-room": () => html`<${LiveRoom} key=${view.id} id=${view.id} />`,
      "a-dash": () => html`<${AdminDashboard} />`, "a-verify": () => html`<${Verification} />`, "a-live": () => html`<${LiveMonitor} />`, "a-pay": () => html`<${Payments} />`, "a-users": () => html`<${Users} />`, "a-audit": () => html`<${AuditLog} />`, "a-auction": () => html`<${AuctionDetail} key=${view.id} id=${view.id} adminMode=${true} />`,
    }[v];
    const active = PARENT[v] || v;
    const demoUsers = [1, 2, 3].map(usr);
    body = html`<div class="app">
      <aside class="side">
        <div class="brand"><div class="brand-mark">W</div><div><b>Wardly</b><small>${t("app_tag")}</small></div></div>
        <div class="nav-label">${t("role_" + user.role)}</div>
        <nav class="nav" ref=${navRef}>${navInd ? html`<span class="nav-ind" style=${{ transform: `translateY(${navInd.y}px)`, height: navInd.h + "px" }}></span>` : null}${NAV[user.role].map(([k, label, ic]) => { const b = navBadge(k, user); return html`<button key=${k} class=${active === k ? "on" : ""} onClick=${() => go(k)} aria-current=${active === k ? "page" : null}><${Icon} n=${ic} /><span class="lbl">${t(label)}</span>${b ? html`<span class="badge">${b}</span>` : null}</button>`; })}</nav>
        <div class="who"><div class="avatar">${initials(user.full_name)}</div><div style=${{ minWidth: 0 }}><div class="who-name ellipsis">${user.full_name}</div><div class="who-co ellipsis">${user.company_id ? coName(user.company_id) : "Wardly"}</div></div></div>
      </aside>
      <div class="main">
        <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
        <header class="top">
          <label class="small muted" for="view-as">${t("view_as")}</label>
          <select id="view-as" class="select-role" value=${demoUsers.some((u) => u.id === user.id) ? user.id : ""} onChange=${(e) => e.target.value && login(+e.target.value)}>
            ${!demoUsers.some((u) => u.id === user.id) ? html`<option value="">${user.full_name}</option>` : null}
            ${demoUsers.map((u) => html`<option key=${u.id} value=${u.id}>${t("role_" + u.role)} · ${u.full_name}${u.company_id ? " · " + coName(u.company_id) : ""}</option>`)}
          </select>
          <span class="grow"></span>
          <span class="pill pill-neutral mono" title=${t("sim_clock")}><${Icon} n="clock" />${fTime(clock.now())}</span>
          ${tools}
          <${Bell} />
          <button class="icon-btn" aria-label=${t("logout")} title=${t("logout")} onClick=${logout}><${Icon} n="logout" cls="flip" /></button>
        </header>
        <main class=${"content" + (leaving ? " leaving" : "")} ref=${contentRef}>${page ? page() : null}</main>
        ${navKey ? html`<div class="route-bar" key=${navKey}></div>` : null}
      </div>
    </div>`;
  }
  return html`<${Ctx.Provider} value=${ctx}>
    ${splash !== "show" ? body : null}
    ${splash !== "show" ? html`<${SimPanel} />` : null}
    <div class="toasts" aria-live="polite">${toasts.map((x) => html`<${Toast} key=${x.tid} x=${x} onDone=${() => setToasts((ts) => ts.filter((y) => y.tid !== x.tid))} />`)}</div>
    ${wipe ? html`<${Wipe} key=${wipe.k} x=${wipe.x} y=${wipe.y} />` : null}
    ${splash !== "done" ? html`<${Splash} onReveal=${() => setSplash("reveal")} onDone=${() => setSplash("done")} />` : null}
  <//>`;
}
ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);
