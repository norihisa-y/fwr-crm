import { useState } from "react"

// ─── DADS カラートークン ────────────────────────────────────
const C = {
  primary:      "#0064D9",
  primaryHover: "#004FAD",
  primaryLight: "#E8F0FC",
  text:         "#1A1A1C",
  textSub:      "#595959",
  textMuted:    "#767676",
  textOnDark:   "#FFFFFF",
  border:       "#C9C9C9",
  borderStrong: "#767676",
  bg:           "#F5F5F5",
  bgWhite:      "#FFFFFF",
  bgHover:      "#F0F0F0",
  success:      "#007B43",
  successBg:    "#E8F4EE",
  error:        "#D70015",
  errorBg:      "#FEECEE",
  warning:      "#C85000",
  warningBg:    "#FEF3E8",
  info:         "#005FAF",
  infoBg:       "#E6EFF9",
  sidebarBg:    "#1A1A1C",
  sidebarText:  "#BDBDBD",
  sidebarActive:"#FFFFFF",
  sidebarHover: "#2E2E30",
  divider:      "#E4E4E4",
}

// ─── 権限定義 ──────────────────────────────────────────────
// admin  : 全機能（ユーザー管理含む）
// general: 顧客・商談・活動・受注・タスクの読み書き、ユーザー管理不可
// viewer : 全画面閲覧のみ、追加・編集・削除不可
const ROLES = {
  admin:   { label:"管理者",   color:C.error,   bg:C.errorBg,   border:C.error   },
  general: { label:"一般",     color:C.info,    bg:C.infoBg,    border:C.info    },
  viewer:  { label:"閲覧のみ", color:C.textMuted, bg:"#F0F0F0", border:C.border  },
}

// ─── モックデータ ──────────────────────────────────────────
const mkId = () => Math.random().toString(36).slice(2,9)

const USERS_INIT = [
  { id:"u1", name:"山下 太郎", email:"yamashita@webrepo.jp", role:"admin",   active:true,  createdAt:"2026-01-10" },
  { id:"u2", name:"佐藤 美咲", email:"sato@webrepo.jp",      role:"general", active:true,  createdAt:"2026-02-01" },
  { id:"u3", name:"伊藤 健二", email:"ito@webrepo.jp",       role:"general", active:true,  createdAt:"2026-03-15" },
  { id:"u4", name:"渡辺 愛",   email:"watanabe@webrepo.jp",  role:"viewer",  active:true,  createdAt:"2026-04-01" },
  { id:"u5", name:"中村 拓也", email:"nakamura@webrepo.jp",  role:"viewer",  active:false, createdAt:"2026-04-20" },
]
const CUSTOMERS_INIT = [
  {
    id:"c1", createdAt:"2026-01-15",
    compId:"COMP-0001",
    companyName:"株式会社アルファ", companyNameKana:"カブシキガイシャアルファ",
    corporateNumber:"1234567890123", phone:"03-1234-5678", siteUrl:"https://alpha.co.jp",
    zip:"1000001", address:"東京都千代田区千代田",
    ceoName:"山田 太郎", ceoTitle:"代表取締役社長",
    capital:"50000000", foundedAt:"2000-04",
    business:"ITシステムの開発・販売",
    contactDept:"営業部", contactTitle:"営業部長", contactName:"田中 太郎", contactPhone:"03-1234-5679", contactEmail:"tanaka@alpha.co.jp",
    billingDept:"経理部", billingTitle:"経理部長", billingName:"田中 花子", billingPhone:"03-1234-5680", billingEmail:"billing@alpha.co.jp",
    billingTiming:"先請求", billingPaymentMonth:"翌月",
    billingInvoiceNotes:"", billingMemo:"",
    assignedUserId:"u2",
    notes:"大口顧客。毎月定例あり。",
  },
  {
    id:"c2", createdAt:"2026-02-10",
    compId:"COMP-0002",
    companyName:"ベータ商事", companyNameKana:"ベータショウジ",
    corporateNumber:"", phone:"06-2345-6789", siteUrl:"",
    zip:"5300001", address:"大阪府大阪市北区梅田",
    ceoName:"鈴木 一郎", ceoTitle:"代表取締役",
    capital:"10000000", foundedAt:"2010-06",
    business:"各種商品の卸売・販売",
    contactDept:"営業部", contactTitle:"営業担当", contactName:"鈴木 花子", contactPhone:"06-2345-6789", contactEmail:"suzuki@beta.co.jp",
    billingDept:"", billingTitle:"", billingName:"", billingPhone:"", billingEmail:"billing@beta.co.jp",
    billingTiming:"当月請求", billingPaymentMonth:"翌月",
    billingInvoiceNotes:"", billingMemo:"",
    assignedUserId:"u3",
    notes:"",
  },
  {
    id:"c3", createdAt:"2026-03-05",
    compId:"COMP-0003",
    companyName:"ガンマ工業", companyNameKana:"ガンマコウギョウ",
    corporateNumber:"", phone:"052-3456-7890", siteUrl:"https://gamma.co.jp",
    zip:"4600001", address:"愛知県名古屋市中区栄",
    ceoName:"山田 一郎", ceoTitle:"社長",
    capital:"30000000", foundedAt:"1995-11",
    business:"精密機器の製造・販売",
    contactDept:"営業部", contactTitle:"部長", contactName:"山田 次郎", contactPhone:"052-3456-7891", contactEmail:"yamada@gamma.co.jp",
    billingDept:"", billingTitle:"", billingName:"", billingPhone:"", billingEmail:"",
    billingTiming:"", billingPaymentMonth:"",
    billingInvoiceNotes:"", billingMemo:"",
    assignedUserId:"u2",
    notes:"新規開拓中",
  },
]

// ─── ブランドDB ────────────────────────────────────────────
// プランはマスタ管理画面で追加・編集・削除可能
const PLANS_INIT = [
  { id:"p1", name:"ライトプラン",      monthlyFee:80000,  sortOrder:1, notes:"" },
  { id:"p2", name:"スタンダードプラン", monthlyFee:150000, sortOrder:2, notes:"" },
  { id:"p3", name:"スペシャルプラン",   monthlyFee:400000, sortOrder:3, notes:"" },
]
const DEFAULT_CONTRACT_TERM = "6ヶ月"
const CONTRACT_TERM_OPTIONS    = ["6ヶ月", "12ヶ月", "その他"]
const BILLING_TIMING_OPTIONS   = ["先々請求", "先請求", "当月請求", "後請求", "後々請求"]
const BILLING_PAYMENT_OPTIONS  = ["当月", "翌月", "翌々月"]
const BILLING_PATTERN_OPTIONS = ["会社単位", "ブランド別", "統合"]
const BRAND_STATUS_CFG = {
  negotiating: { label:"商談中",   color:C.info,    bg:C.infoBg,    border:C.info    },
  contracted:  { label:"契約済み", color:C.success, bg:C.successBg, border:C.success },
  reviewing:   { label:"審査中",   color:C.warning, bg:C.warningBg, border:C.warning },
  active:      { label:"掲載中",   color:"#007B43", bg:"#E8F4EE",   border:"#007B43" },
  cancelled:   { label:"解約済み", color:C.error,   bg:C.errorBg,   border:C.error   },
}

// 承認ステータス
const APPROVAL_STATUS_CFG = {
  none:     { label:"未申請",  color:C.textMuted, bg:"#F0F0F0",   border:C.border  },
  pending:  { label:"申請中",  color:C.warning,   bg:C.warningBg, border:C.warning },
  approved: { label:"承認済み",color:C.success,   bg:C.successBg, border:C.success },
}

// 書類チェックリスト定義（将来的にマスタ管理に移動可）
const DOC_TYPES = [
  { key:"docMaterial",    label:"加盟希望者向け資料" },
  { key:"docContract",    label:"加盟契約書の雛形"   },
  { key:"docRegistration",label:"法人登記簿の写し"   },
  { key:"docDisclosure",  label:"法定開示書面"       },
  { key:"docTrademark",   label:"商標登録証"         },
]

// 書類ステータス
const DOC_STATUS_OPTIONS = ["未提出", "提出済み", "確認中", "承認済み"]

// ステージ定義（⑥ 段階的情報収集）
const STAGES = [
  { key:"s1", label:"見積",   fields:["companyName","address","plan","monthlyFee","contractTerm"] },
  { key:"s2", label:"申込",   fields:["signerName","signerEmail","applicationUrl"] },
  { key:"s3", label:"情報収集",fields:["billingName","billingEmail","notifyEmail"] },
  { key:"s4", label:"審査",   fields:["docMaterial","docContract","docRegistration","docDisclosure","docTrademark"] },
]

const BRANDS_INIT = [
  {
    id:"b1", createdAt:"2026-01-20", chainId:"CHAIN-0001",
    brandName:"アルファFC", customerId:"c1",
    contractStatus:"active", plan:"スペシャルプラン", monthlyFee:400000,
    contractTerm:"6ヶ月", contractStartDate:"2026-02-01", nextRenewalDate:"2027-01-31",
    billingPattern:"会社単位", notifyEmail:"fc@alpha.co.jp",
    docsFolderUrl:"https://drive.google.com/drive/folders/dummy1",
    quotationUrl:"https://invoice.moneyforward.com/dummy1",
    applicationUrl:"https://cloudsign.jp/dummy_signed1", invoiceUrl:"https://invoice.moneyforward.com/inv1",
    signerName:"田中 太郎", signerEmail:"tanaka@alpha.co.jp",
    approvalStatus:"approved", approvalDate:"2026-01-18", approvalSlackUrl:"",
    docMaterial:"承認済み", docContract:"承認済み", docRegistration:"承認済み",
    docDisclosure:"承認済み", docTrademark:"承認済み",
    assignedUserId:"u2", notes:"主力ブランド",
  },
  {
    id:"b2", createdAt:"2026-02-15", chainId:"CHAIN-0002",
    brandName:"アルファFC プレミアム", customerId:"c1",
    contractStatus:"reviewing", plan:"スペシャルプラン", monthlyFee:400000,
    contractTerm:"6ヶ月", contractStartDate:"", nextRenewalDate:"",
    billingPattern:"ブランド別", notifyEmail:"premium@alpha.co.jp",
    docsFolderUrl:"", quotationUrl:"https://invoice.moneyforward.com/dummy2",
    applicationUrl:"", invoiceUrl:"",
    signerName:"山田 花子", signerEmail:"yamada@alpha.co.jp",
    approvalStatus:"approved", approvalDate:"2026-02-14", approvalSlackUrl:"",
    docMaterial:"提出済み", docContract:"確認中", docRegistration:"未提出",
    docDisclosure:"未提出", docTrademark:"未提出",
    assignedUserId:"u2", notes:"審査書類確認中",
  },
  {
    id:"b3", createdAt:"2026-03-01", chainId:"CHAIN-0003",
    brandName:"ベータ商事FC", customerId:"c2",
    contractStatus:"contracted", plan:"スタンダードプラン", monthlyFee:150000,
    contractTerm:"6ヶ月", contractStartDate:"2026-04-01", nextRenewalDate:"2026-09-30",
    billingPattern:"会社単位", notifyEmail:"fc@beta.co.jp",
    docsFolderUrl:"https://drive.google.com/drive/folders/dummy2",
    quotationUrl:"", applicationUrl:"https://cloudsign.jp/dummy1", invoiceUrl:"",
    signerName:"鈴木 花子", signerEmail:"suzuki@beta.co.jp",
    approvalStatus:"approved", approvalDate:"2026-02-28", approvalSlackUrl:"",
    docMaterial:"未提出", docContract:"未提出", docRegistration:"未提出",
    docDisclosure:"未提出", docTrademark:"未提出",
    assignedUserId:"u3", notes:"",
  },
]
const DEALS_INIT = [
  { id:"d1", customerId:"c1", brandId:"b1", stage:"negotiation", assignedUserId:"u2",
    actionDate:"2026-05-02", actionTime:"10:00",
    proposedPlan:"スペシャルプラン", nextAction:"デモ資料を作成して送付",
    minutesUrl:"https://docs.google.com/document/d/dummy1",
    notes:"担当者3名参加。次回はデモ予定。" },
  { id:"d2", customerId:"c2", brandId:"b3", stage:"proposal",    assignedUserId:"u3",
    actionDate:"2026-05-01", actionTime:"14:30",
    proposedPlan:"スタンダードプラン", nextAction:"見積書を修正して再送",
    minutesUrl:"",
    notes:"金額交渉あり。" },
  { id:"d3", customerId:"c3", brandId:null, stage:"prospecting", assignedUserId:"u2",
    actionDate:"2026-04-28", actionTime:"13:00",
    proposedPlan:"ライトプラン", nextAction:"提案書作成",
    minutesUrl:"",
    notes:"初回ヒアリング完了。" },
  { id:"d4", customerId:"c1", brandId:"b2", stage:"won",         assignedUserId:"u2",
    actionDate:"2026-04-25", actionTime:"11:00",
    proposedPlan:"スペシャルプラン", nextAction:"",
    minutesUrl:"https://docs.google.com/document/d/dummy2",
    notes:"" },
]
const ACTIVITIES_INIT = [
  { id:"a1", customerId:"c1", dealId:"d1", type:"meeting",
    activityDate:"2026-05-02", activityTime:"10:00",
    summary:"要件定義MTG。担当者3名参加。次回はデモ予定。", assignedUserId:"u2" },
  { id:"a2", customerId:"c2", dealId:"d2", type:"call",
    activityDate:"2026-05-01", activityTime:"14:30",
    summary:"更新条件について電話確認。金額交渉あり。", assignedUserId:"u3" },
  { id:"a3", customerId:"c3", dealId:"d3", type:"visit",
    activityDate:"2026-04-28", activityTime:"13:00",
    summary:"初回訪問。ニーズヒアリング完了。", assignedUserId:"u2" },
]
const TASKS_INIT = [
  { id:"t1", title:"デモ資料作成", customerId:"c1", dueDate:"2026-05-10", done:false, assignedUserId:"u2" },
  { id:"t2", title:"見積書送付",   customerId:"c2", dueDate:"2026-05-07", done:false, assignedUserId:"u3" },
  { id:"t3", title:"提案書作成",   customerId:"c3", dueDate:"2026-05-15", done:false, assignedUserId:"u2" },
  { id:"t4", title:"契約書確認",   customerId:"c1", dueDate:"2026-04-20", done:true,  assignedUserId:"u2" },
]

const STAGE_CFG = {
  prospecting: { label:"見込み",   color:C.textMuted, bg:"#F0F0F0",  border:C.border   },
  proposal:    { label:"提案中",   color:C.info,      bg:C.infoBg,   border:C.info     },
  negotiation: { label:"交渉中",   color:C.warning,   bg:C.warningBg,border:C.warning  },
  won:         { label:"受注",     color:C.success,   bg:C.successBg,border:C.success  },
  lost:        { label:"失注",     color:C.error,     bg:C.errorBg,  border:C.error    },
}
const TYPE_CFG = {
  visit:   { label:"訪問",   color:C.info,     bg:C.infoBg     },
  call:    { label:"電話",   color:C.success,  bg:C.successBg  },
  email:   { label:"メール", color:C.textSub,  bg:"#F0F0F0"    },
  meeting: { label:"会議",   color:C.warning,  bg:C.warningBg  },
  other:   { label:"その他", color:C.textMuted,bg:"#F5F5F5"    },
}
const ORDER_CFG = {
  pending:   { label:"保留",       color:C.textMuted, bg:"#F0F0F0"   },
  confirmed: { label:"確認済",     color:C.info,      bg:C.infoBg    },
  delivered: { label:"納品済",     color:C.success,   bg:C.successBg },
  cancelled: { label:"キャンセル", color:C.error,     bg:C.errorBg   },
}

const NAV_ITEMS = [
  { key:"dashboard",  label:"ダッシュボード", roles:["admin","general","viewer"] },
  { key:"customers",  label:"顧客管理",       roles:["admin","general","viewer"] },
  { key:"staging",    label:"取り込み待ち",   roles:["admin","general"] },
  { key:"brands",     label:"ブランド管理",   roles:["admin","general","viewer"] },
  { key:"deals",      label:"商談管理",       roles:["admin","general","viewer"] },
  { key:"activities", label:"活動履歴",       roles:["admin","general","viewer"] },
  { key:"tasks",      label:"タスク",         roles:["admin","general","viewer"] },
  { key:"users",      label:"ユーザー管理",   roles:["admin"] },
  { key:"master",     label:"マスタ管理",     roles:["admin"] },
]

// ─── ユーティリティ ─────────────────────────────────────────
const fmt        = n => `¥${Number(n||0).toLocaleString()}`
const fmtNum     = n => n ? Number(n).toLocaleString() : "—"   // カンマ区切り（資本金等）
const fmtD       = s => s ? new Date(s).toLocaleDateString("ja-JP",{year:"numeric",month:"2-digit",day:"2-digit"}) : "—"
const fmtDT      = (d,t) => d ? `${fmtD(d)} ${t||""}`.trim() : "—"
const todayS     = () => new Date().toISOString().slice(0,10)

// 30分単位の時間選択肢（00:00 〜 23:30）
const TIME_OPTIONS = Array.from({length:48}, (_,i) => {
  const h = String(Math.floor(i/2)).padStart(2,"0")
  const m = i%2===0 ? "00" : "30"
  return `${h}:${m}`
})

// 権限チェックヘルパー
const can = (role, action) => {
  if (action === "write")       return role === "admin" || role === "general"
  if (action === "manageUsers") return role === "admin"
  return true // read は全員可
}

// ─── 共通UIコンポーネント ───────────────────────────────────
function StatusBadge({ cfg }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", padding:"2px 8px",
      fontSize:12, fontWeight:700, letterSpacing:"0.02em",
      color:cfg.color, background:cfg.bg,
      border:`1px solid ${cfg.border||cfg.color}`,
      borderRadius:0, lineHeight:"1.3", whiteSpace:"nowrap",
    }}>{cfg.label}</span>
  )
}

function PageHeader({ title, sub, action }) {
  return (
    <div style={{
      display:"flex", justifyContent:"space-between", alignItems:"flex-end",
      paddingBottom:16, marginBottom:16,
      borderBottom:`2px solid ${C.primary}`,
    }}>
      <div>
        <h2 style={{margin:0, fontSize:20, fontWeight:700, color:C.text, letterSpacing:"0.02em", lineHeight:"1.4"}}>{title}</h2>
        {sub && <p style={{margin:"4px 0 0", fontSize:14, color:C.textMuted, lineHeight:"1.3"}}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

function PrimaryBtn({ children, onClick, disabled }) {
  const [hov,setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        padding:"9px 20px", fontSize:14, fontWeight:700, letterSpacing:"0.02em",
        border:"none", cursor:disabled?"not-allowed":"pointer", borderRadius:0,
        background:disabled?"#C9C9C9":hov?C.primaryHover:C.primary,
        color:C.textOnDark, lineHeight:"1", transition:"background 0.1s", fontFamily:"inherit",
      }}>{children}</button>
  )
}
function SecondaryBtn({ children, onClick }) {
  const [hov,setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        padding:"8px 20px", fontSize:14, fontWeight:700, letterSpacing:"0.02em",
        border:`1px solid ${C.border}`, cursor:"pointer", borderRadius:0,
        background:hov?C.bgHover:C.bgWhite, color:C.text,
        lineHeight:"1", transition:"background 0.1s", fontFamily:"inherit",
      }}>{children}</button>
  )
}
function DangerBtn({ children, onClick }) {
  const [hov,setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", justifyContent:"center",
        padding:"8px 20px", fontSize:14, fontWeight:700, letterSpacing:"0.02em",
        border:`1px solid ${C.error}`, cursor:"pointer", borderRadius:0,
        background:hov?C.errorBg:C.bgWhite, color:C.error,
        lineHeight:"1", transition:"background 0.1s", fontFamily:"inherit",
      }}>{children}</button>
  )
}

function ReadonlyBanner() {
  return (
    <div style={{
      background:C.warningBg, border:`1px solid ${C.warning}`,
      borderLeft:`4px solid ${C.warning}`, padding:"10px 16px",
      fontSize:13, color:C.warning, fontWeight:700, marginBottom:16,
      display:"flex", alignItems:"center", gap:8,
    }}>
      ⚠　閲覧専用モードです。データの追加・編集・削除はできません。
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div style={{marginBottom:16}}>
      <label style={{display:"block", fontSize:14, fontWeight:700, color:C.text, marginBottom:6, letterSpacing:"0.02em", lineHeight:"1.3"}}>
        {label}
        {required && <span style={{color:C.error, marginLeft:4, fontSize:12}}>必須</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ textarea, select, children, ...p }) {
  const base = {
    width:"100%", boxSizing:"border-box", padding:"8px 12px", fontSize:16,
    border:`1px solid ${C.border}`, borderRadius:0, background:C.bgWhite,
    color:C.text, outline:"none", fontFamily:"inherit",
    lineHeight:"1.3", letterSpacing:"0.02em",
  }
  if (textarea) return <textarea {...p} rows={3} style={{...base, resize:"vertical"}} />
  if (select)   return <select  {...p} style={{...base, cursor:"pointer"}}>{children}</select>
  return <input {...p} style={base} />
}

function DataTable({ headers, children }) {
  return (
    <div style={{border:`1px solid ${C.border}`, overflow:"hidden"}}>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr style={{background:C.sidebarBg}}>
            {headers.map(h=>(
              <th key={h} style={{
                textAlign:"left", padding:"10px 16px",
                fontSize:12, fontWeight:700, letterSpacing:"0.08em",
                color:C.sidebarText, borderBottom:`1px solid ${C.borderStrong}`,
                whiteSpace:"nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Tr({ children, onClick }) {
  const [hov,setHov] = useState(false)
  return (
    <tr onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      onClick={onClick}
      style={{background:hov?C.bgHover:C.bgWhite, transition:"background 0.1s", cursor:onClick?"pointer":"default"}}>
      {children}
    </tr>
  )
}

function Td({ children, bold, right, muted }) {
  return (
    <td style={{
      padding:"11px 16px", fontSize:14,
      color:muted?C.textMuted:bold?C.text:C.textSub,
      fontWeight:bold?700:400, textAlign:right?"right":"left",
      borderBottom:`1px solid ${C.divider}`,
      letterSpacing:"0.01em", lineHeight:"1.3", whiteSpace:"nowrap",
    }}>{children}</td>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"rgba(0,0,0,0.55)"}}>
      <div style={{background:C.bgWhite,width:"100%",maxWidth:480,boxShadow:"0 8px 32px rgba(0,0,0,0.3)",borderTop:`3px solid ${C.primary}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:`1px solid ${C.divider}`}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.text,letterSpacing:"0.02em"}}>{title}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.textMuted,lineHeight:1,padding:"0 4px"}}>×</button>
        </div>
        <div style={{padding:"20px 20px 24px"}}>{children}</div>
      </div>
    </div>
  )
}

function SectionBox({ title, children }) {
  return (
    <div style={{background:C.bgWhite, border:`1px solid ${C.border}`}}>
      <div style={{padding:"10px 16px",fontSize:13,fontWeight:700,letterSpacing:"0.04em",color:C.textOnDark,background:C.sidebarBg,borderBottom:`1px solid ${C.borderStrong}`}}>{title}</div>
      <div style={{padding:16}}>{children}</div>
    </div>
  )
}

function KpiCard({ label, value, sub, accentColor }) {
  return (
    <div style={{background:C.bgWhite,padding:"16px 20px",border:`1px solid ${C.border}`,borderTop:`3px solid ${accentColor}`}}>
      <div style={{fontSize:12,fontWeight:700,color:C.textMuted,letterSpacing:"0.08em",marginBottom:8}}>{label}</div>
      <div style={{fontSize:24,fontWeight:700,color:C.text,letterSpacing:"-0.01em",lineHeight:1,marginBottom:6}}>{value}</div>
      <div style={{fontSize:12,color:C.textMuted}}>{sub}</div>
    </div>
  )
}

// ─── 取り込みレビュー画面 ───────────────────────────────────
// Googleフォーム → GAS → staging_imports テーブル → ここで確認
function StagingReview({ staging, setStaging, setCustomers, users }) {
  const [editModal, setEditModal] = useState(null)   // null | staging record
  const [form,      setForm]      = useState({})
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}))

  const pending  = staging.filter(s => s.status === "pending")
  const imported = staging.filter(s => s.status === "imported")

  // 承認して取り込む：そのままcustomers に追加
  const approve = (s) => {
    setCustomers(p => [...p, { id:mkId(), createdAt:todayS(), ...s.data }])
    setStaging(p => p.map(x => x.id===s.id ? {...x, status:"imported", reviewedAt:todayS()} : x))
  }

  // 修正して取り込む：編集フォームを開く
  const openEdit = (s) => { setForm({...s.data}); setEditModal(s) }

  // 修正内容で取り込む
  const saveEdit = () => {
    setCustomers(p => [...p, { id:mkId(), createdAt:todayS(), ...form }])
    setStaging(p => p.map(x => x.id===editModal.id ? {...x, status:"imported", reviewedAt:todayS()} : x))
    setEditModal(null); setForm({})
  }

  const FIELDS_TO_REVIEW = [
    { key:"companyName",     label:"会社名"           },
    { key:"companyNameKana", label:"会社名フリガナ"   },
    { key:"corporateNumber", label:"法人番号"          },
    { key:"phone",           label:"代表電話番号"      },
    { key:"zip",             label:"郵便番号"          },
    { key:"address",         label:"住所"              },
    { key:"ceoTitle",        label:"代表者役職"        },
    { key:"ceoName",         label:"代表者名"          },
    { key:"contactDept",     label:"担当者_部署名"     },
    { key:"contactTitle",    label:"担当者_役職"       },
    { key:"contactName",     label:"担当者_氏名"       },
    { key:"contactPhone",    label:"担当者_電話"       },
    { key:"contactEmail",    label:"担当者_メール"     },
    { key:"billingDept",     label:"請求先_部署名"     },
    { key:"billingTitle",    label:"請求先_役職"       },
    { key:"billingName",     label:"請求先_氏名"       },
    { key:"billingPhone",    label:"請求先_電話"       },
    { key:"billingEmail",    label:"請求先_メール"     },
    { key:"billingTiming",   label:"請求タイミング"   },
    { key:"billingPaymentMonth", label:"入金予定月"   },
    { key:"notes",           label:"備考"              },
  ]

  return (
    <div style={{padding:24}}>
      <PageHeader title="取り込み待ち" sub={`確認待ち ${pending.length}件　取り込み済み ${imported.length}件`} />

      {/* 説明バナー */}
      <div style={{background:C.infoBg, border:`1px solid ${C.info}`, borderLeft:`4px solid ${C.info}`, padding:"10px 16px", marginBottom:20}}>
        <p style={{margin:0, fontSize:13, color:C.info, lineHeight:"1.6"}}>
          Googleフォームで顧客が入力した情報が表示されます。内容を確認してから顧客DBに取り込んでください。<br/>
          <strong>承認して取り込む</strong>：内容をそのまま顧客DBに登録します。　
          <strong>修正して取り込む</strong>：内容を編集してから顧客DBに登録します。
        </p>
      </div>

      {/* 確認待ち */}
      {pending.length === 0 ? (
        <div style={{padding:"32px 0", textAlign:"center", color:C.textMuted, fontSize:14}}>確認待ちの取り込みデータはありません</div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:12, marginBottom:32}}>
          {pending.map(s => (
            <div key={s.id} style={{background:C.bgWhite, border:`1px solid ${C.border}`, borderLeft:`4px solid ${C.warning}`}}>
              {/* ヘッダー */}
              <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:`1px solid ${C.divider}`, background:"#FFFBEB"}}>
                <div>
                  <span style={{fontSize:14, fontWeight:700, color:C.text}}>{s.data.companyName||"（会社名未入力）"}</span>
                  <span style={{fontSize:12, color:C.textMuted, marginLeft:12}}>受信日時：{fmtDT(s.submittedAt)}</span>
                </div>
                <div style={{display:"flex", gap:8}}>
                  <PrimaryBtn onClick={()=>approve(s)}>承認して取り込む</PrimaryBtn>
                  <SecondaryBtn onClick={()=>openEdit(s)}>修正して取り込む</SecondaryBtn>
                </div>
              </div>
              {/* データプレビュー */}
              <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:0}}>
                {FIELDS_TO_REVIEW.map((fd, i) => (
                  <div key={fd.key} style={{
                    padding:"8px 16px",
                    borderBottom: i < FIELDS_TO_REVIEW.length - 3 ? `1px solid ${C.divider}` : "none",
                    borderRight: (i%3 < 2) ? `1px solid ${C.divider}` : "none",
                  }}>
                    <div style={{fontSize:11, color:C.textMuted, marginBottom:2}}>{fd.label}</div>
                    <div style={{
                      fontSize:13, color: s.data[fd.key] ? C.text : C.textMuted,
                      fontStyle: s.data[fd.key] ? "normal" : "italic",
                    }}>
                      {s.data[fd.key] || "未入力"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 取り込み済み */}
      {imported.length > 0 && (
        <>
          <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", marginBottom:8, paddingTop:8, borderTop:`1px solid ${C.divider}`}}>取り込み済み</div>
          <DataTable headers={["会社名","取り込み日"]}>
            {imported.map(s=>(
              <Tr key={s.id}>
                <Td bold>{s.data.companyName}</Td>
                <Td muted>{fmtD(s.reviewedAt)}</Td>
              </Tr>
            ))}
          </DataTable>
        </>
      )}

      {/* 修正モーダル */}
      {editModal && (
        <div style={{position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(0,0,0,0.55)"}}>
          <div style={{background:C.bgWhite, width:"100%", maxWidth:640, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 8px 32px rgba(0,0,0,0.3)", borderTop:`3px solid ${C.warning}`}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${C.divider}`, flexShrink:0}}>
              <h3 style={{margin:0, fontSize:16, fontWeight:700, color:C.text}}>修正して取り込む：{editModal.data.companyName}</h3>
              <button onClick={()=>setEditModal(null)} style={{background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.textMuted, lineHeight:1}}>×</button>
            </div>
            <div style={{flex:1, overflowY:"auto", padding:"20px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                {FIELDS_TO_REVIEW.map(fd=>(
                  <FormField key={fd.key} label={fd.label}>
                    {fd.key==="notes" ? (
                      <TextInput textarea value={form[fd.key]||""} onChange={f(fd.key)} />
                    ) : (
                      <TextInput value={form[fd.key]||""} onChange={f(fd.key)} />
                    )}
                  </FormField>
                ))}
              </div>
            </div>
            <div style={{flexShrink:0, padding:"12px 20px 20px", borderTop:`1px solid ${C.divider}`, display:"flex", gap:8}}>
              <PrimaryBtn onClick={saveEdit}>修正内容で取り込む</PrimaryBtn>
              <SecondaryBtn onClick={()=>setEditModal(null)}>キャンセル</SecondaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── マスタ管理（管理者専用） ──────────────────────────────
function MasterManagement({ plans, setPlans }) {
  const [editPlan,  setEditPlan]  = useState(null)  // null | "add" | plan object
  const [planForm,  setPlanForm]  = useState({})
  const fp = k => e => setPlanForm(p => ({...p, [k]: e.target.value}))

  const openAddPlan  = () => { setPlanForm({ name:"", notes:"" }); setEditPlan("add") }
  const openEditPlan = p  => { setPlanForm({...p}); setEditPlan(p) }
  const closePlan    = () => { setEditPlan(null); setPlanForm({}) }

  const savePlan = () => {
    if (!planForm.name?.trim()) return
    const maxOrder = plans.length > 0 ? Math.max(...plans.map(p=>p.sortOrder||0)) : 0
    if (editPlan === "add") {
      setPlans(p => [...p, {
        id: mkId(),
        name: planForm.name.trim(),
        monthlyFee: planForm.monthlyFee ? Number(planForm.monthlyFee) : 0,
        sortOrder: maxOrder+1,
        notes: planForm.notes||"",
      }])
    } else {
      setPlans(p => p.map(x => x.id === editPlan.id ? {
        ...x,
        name: planForm.name.trim(),
        monthlyFee: planForm.monthlyFee ? Number(planForm.monthlyFee) : 0,
        notes: planForm.notes||"",
      } : x))
    }
    closePlan()
  }

  const deletePlan = id => {
    if (confirm("削除しますか？\n※このプランを使用中のブランドがある場合は表示が「—」になります。")) {
      setPlans(p => p.filter(x => x.id !== id))
      closePlan()
    }
  }

  const moveUp   = id => setPlans(p => {
    const i = p.findIndex(x=>x.id===id)
    if (i <= 0) return p
    const arr = [...p]
    ;[arr[i-1], arr[i]] = [arr[i], arr[i-1]]
    return arr.map((x,idx) => ({...x, sortOrder:idx+1}))
  })
  const moveDown = id => setPlans(p => {
    const i = p.findIndex(x=>x.id===id)
    if (i >= p.length-1) return p
    const arr = [...p]
    ;[arr[i], arr[i+1]] = [arr[i+1], arr[i]]
    return arr.map((x,idx) => ({...x, sortOrder:idx+1}))
  })

  const sorted = [...plans].sort((a,b) => (a.sortOrder||0)-(b.sortOrder||0))

  return (
    <div style={{padding:24}}>
      <PageHeader title="マスタ管理" sub="管理者のみ編集可能" />

      {/* 利用プラン */}
      <div style={{marginBottom:32}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
          <div>
            <div style={{fontSize:15, fontWeight:700, color:C.text}}>利用プラン</div>
            <div style={{fontSize:12, color:C.textMuted, marginTop:2}}>ブランド管理の「利用プラン」選択肢を管理します。並び順は↑↓で変更できます。</div>
          </div>
          <PrimaryBtn onClick={openAddPlan}>＋ プランを追加</PrimaryBtn>
        </div>

        <div style={{border:`1px solid ${C.border}`, overflow:"hidden"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:C.sidebarBg}}>
                {["順序","プラン名","月額利用料","備考","操作"].map(h=>(
                  <th key={h} style={{textAlign:"left", padding:"10px 16px", fontSize:12, fontWeight:700, letterSpacing:"0.08em", color:C.sidebarText, borderBottom:`1px solid ${C.borderStrong}`, whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, idx) => (
                <tr key={p.id} style={{background:C.bgWhite, borderBottom:`1px solid ${C.divider}`}}>
                  <td style={{padding:"10px 16px", width:80}}>
                    <div style={{display:"flex", gap:4}}>
                      <button onClick={()=>moveUp(p.id)} disabled={idx===0}
                        style={{padding:"2px 6px", fontSize:12, background:idx===0?"#F0F0F0":C.bgWhite, border:`1px solid ${C.border}`, color:idx===0?C.textMuted:C.text, cursor:idx===0?"not-allowed":"pointer", fontFamily:"inherit"}}>↑</button>
                      <button onClick={()=>moveDown(p.id)} disabled={idx===sorted.length-1}
                        style={{padding:"2px 6px", fontSize:12, background:idx===sorted.length-1?"#F0F0F0":C.bgWhite, border:`1px solid ${C.border}`, color:idx===sorted.length-1?C.textMuted:C.text, cursor:idx===sorted.length-1?"not-allowed":"pointer", fontFamily:"inherit"}}>↓</button>
                    </div>
                  </td>
                  <td style={{padding:"10px 16px", fontSize:14, fontWeight:700, color:C.text}}>{p.name}</td>
                  <td style={{padding:"10px 16px", fontSize:14, fontWeight:700, color:C.text, whiteSpace:"nowrap"}}>{p.monthlyFee ? fmt(p.monthlyFee) : "—"}</td>
                  <td style={{padding:"10px 16px", fontSize:13, color:C.textSub}}>{p.notes||"—"}</td>
                  <td style={{padding:"10px 16px", whiteSpace:"nowrap"}}>
                    <button onClick={()=>openEditPlan(p)} style={{fontSize:13, color:C.primary, background:"none", border:"none", cursor:"pointer", padding:"2px 8px", fontWeight:700, textDecoration:"underline", fontFamily:"inherit"}}>編集</button>
                    <span style={{color:C.border, margin:"0 2px"}}>|</span>
                    <button onClick={()=>deletePlan(p.id)} style={{fontSize:13, color:C.error, background:"none", border:"none", cursor:"pointer", padding:"2px 8px", fontWeight:700, textDecoration:"underline", fontFamily:"inherit"}}>削除</button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={4} style={{padding:"24px 16px", textAlign:"center", fontSize:13, color:C.textMuted}}>プランが登録されていません</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 注意書き */}
        <div style={{marginTop:10, background:C.warningBg, border:`1px solid ${C.warning}`, borderLeft:`4px solid ${C.warning}`, padding:"10px 14px"}}>
          <p style={{margin:0, fontSize:13, color:C.warning, lineHeight:"1.6"}}>
            ⚠　プランを削除しても、すでに設定済みのブランドのプラン値はそのまま残ります。<br/>
            変更・削除前に該当ブランドのプランを更新することを推奨します。
          </p>
        </div>
      </div>

      {/* プラン追加・編集モーダル */}
      {editPlan && (
        <Modal title={editPlan==="add" ? "プランを追加" : `プランを編集：${planForm.name}`} onClose={closePlan}>
          <FormField label="プラン名" required>
            <TextInput value={planForm.name||""} onChange={fp("name")} placeholder="〇〇プラン" />
          </FormField>
          <FormField label="月額利用料（円）">
            <TextInput type="number" value={planForm.monthlyFee||""} onChange={fp("monthlyFee")} placeholder="100000" />
            {planForm.monthlyFee && <p style={{margin:"3px 0 0", fontSize:11, color:C.textMuted}}>{fmt(planForm.monthlyFee)}</p>}
          </FormField>
          <FormField label="備考">
            <TextInput textarea value={planForm.notes||""} onChange={fp("notes")} placeholder="プランの説明（任意）" />
          </FormField>
          <div style={{display:"flex", gap:8, marginTop:8}}>
            <PrimaryBtn onClick={savePlan}>保存する</PrimaryBtn>
            <SecondaryBtn onClick={closePlan}>キャンセル</SecondaryBtn>
            {editPlan !== "add" && <DangerBtn onClick={()=>deletePlan(editPlan.id)}>削除</DangerBtn>}
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── ユーザー管理画面（管理者専用） ────────────────────────
function UserManagement({ users, setUsers, currentRole }) {
  // modal: null | "add" | "edit"  ← 文字列のみで管理
  const [modal,  setModal]  = useState(null)
  const [editId, setEditId] = useState(null)  // 編集対象のユーザーID
  const [form,   setForm]   = useState({})
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}))

  const openAdd = () => {
    setForm({ name:"", email:"", role:"general", active:true })
    setEditId(null)
    setModal("add")
  }

  const openEdit = (u) => {
    setForm({ ...u })   // ユーザーの全フィールドをフォームにコピー
    setEditId(u.id)
    setModal("edit")
  }

  const closeModal = () => { setModal(null); setEditId(null); setForm({}) }

  const save = () => {
    if (!form.name.trim() || !form.email.trim() || !form.role) return
    if (modal === "add") {
      setUsers(p => [...p, {
        id: mkId(),
        createdAt: todayS(),
        active: true,
        name:  form.name.trim(),
        email: form.email.trim(),
        role:  form.role,
      }])
    } else {
      // 編集：editId で対象を特定して上書き
      setUsers(p => p.map(u => u.id === editId ? {
        ...u,
        name:   form.name.trim(),
        email:  form.email.trim(),
        role:   form.role,
        active: form.active,
      } : u))
    }
    closeModal()
  }

  const toggleActive = (u) => {
    if (u.id === "u1") { alert("自分自身のアカウントは変更できません。"); return }
    setUsers(p => p.map(x => x.id === u.id ? {...x, active: !x.active} : x))
  }

  const activeCount  = users.filter(u => u.active).length
  const adminCount   = users.filter(u => u.role==="admin"   && u.active).length
  const generalCount = users.filter(u => u.role==="general" && u.active).length
  const viewerCount  = users.filter(u => u.role==="viewer"  && u.active).length

  const roleDesc = {
    admin:   "全機能が利用可能です。ユーザーの追加・編集・無効化を含みます。管理者権限は慎重に付与してください。",
    general: "顧客・商談・活動履歴・受注・タスクの閲覧および編集が可能です。ユーザー管理は利用できません。",
    viewer:  "すべての画面を閲覧できますが、データの追加・編集・削除はできません。",
  }

  return (
    <div style={{padding:24}}>
      <PageHeader
        title="ユーザー管理"
        sub={`有効ユーザー ${activeCount}名　管理者 ${adminCount}　一般 ${generalCount}　閲覧のみ ${viewerCount}`}
        action={<PrimaryBtn onClick={openAdd}>＋ ユーザーを追加</PrimaryBtn>}
      />

      {/* 権限説明カード */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20}}>
        {[
          { role:"admin",   desc:"全機能利用可。ユーザー管理を含む。"          },
          { role:"general", desc:"顧客・商談・活動・受注・タスクの読み書き可。" },
          { role:"viewer",  desc:"全画面の閲覧のみ。追加・編集・削除は不可。"  },
        ].map(r => (
          <div key={r.role} style={{background:C.bgWhite, border:`1px solid ${C.border}`, borderTop:`3px solid ${ROLES[r.role].color}`, padding:"12px 16px"}}>
            <div style={{marginBottom:6}}><StatusBadge cfg={ROLES[r.role]} /></div>
            <p style={{margin:0, fontSize:13, color:C.textSub, lineHeight:"1.5"}}>{r.desc}</p>
          </div>
        ))}
      </div>

      {/* ユーザー一覧テーブル */}
      <DataTable headers={["氏名", "メールアドレス", "権限", "登録日", "状態", "操作"]}>
        {users.map(u => (
          <Tr key={u.id}>
            <Td bold>
              {u.name}
              {u.id === "u1" && <span style={{fontSize:11, color:C.textMuted, fontWeight:400, marginLeft:6}}>(ログイン中)</span>}
            </Td>
            <Td>{u.email}</Td>
            <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
              <StatusBadge cfg={ROLES[u.role]} />
            </td>
            <Td muted>{fmtD(u.createdAt)}</Td>
            <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
              <StatusBadge cfg={u.active
                ? {label:"有効", color:C.success,   bg:C.successBg, border:C.success}
                : {label:"無効", color:C.textMuted, bg:"#F0F0F0",   border:C.border}
              } />
            </td>
            <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`, whiteSpace:"nowrap"}}>
              {/* 編集ボタン */}
              <button
                onClick={() => openEdit(u)}
                style={{fontSize:13, color:C.primary, background:"none", border:"none", cursor:"pointer", padding:"2px 8px", fontWeight:700, textDecoration:"underline", fontFamily:"inherit"}}
              >編集</button>
              <span style={{color:C.border, margin:"0 2px"}}>|</span>
              {/* 有効化 / 無効化ボタン */}
              <button
                onClick={() => toggleActive(u)}
                style={{fontSize:13, color:u.active?C.error:C.success, background:"none", border:"none", cursor:"pointer", padding:"2px 8px", fontWeight:700, textDecoration:"underline", fontFamily:"inherit"}}
              >{u.active ? "無効化" : "有効化"}</button>
            </td>
          </Tr>
        ))}
      </DataTable>

      {/* 追加 / 編集モーダル */}
      {modal && (
        <Modal
          title={modal === "add" ? "ユーザーを追加" : `ユーザーを編集：${form.name}`}
          onClose={closeModal}
        >
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <FormField label="氏名" required>
              <TextInput
                value={form.name || ""}
                onChange={f("name")}
                placeholder="山田 太郎"
              />
            </FormField>
            <FormField label="メールアドレス" required>
              <TextInput
                type="email"
                value={form.email || ""}
                onChange={f("email")}
                placeholder="example@co.jp"
              />
            </FormField>
          </div>

          <FormField label="権限" required>
            <TextInput select value={form.role || "general"} onChange={f("role")}>
              {Object.entries(ROLES).map(([k,v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </TextInput>
          </FormField>

          {/* 選択中の権限の説明 */}
          {form.role && (
            <div style={{background:C.bg, border:`1px solid ${C.border}`, padding:"10px 14px", marginBottom:16}}>
              <p style={{margin:0, fontSize:13, color:C.textSub, lineHeight:"1.5"}}>{roleDesc[form.role]}</p>
            </div>
          )}

          {/* 編集時のみ：アカウント状態 */}
          {modal === "edit" && (
            <FormField label="アカウント状態">
              <TextInput
                select
                value={form.active ? "true" : "false"}
                onChange={e => setForm(p => ({...p, active: e.target.value === "true"}))}
              >
                <option value="true">有効</option>
                <option value="false">無効（ログイン不可）</option>
              </TextInput>
            </FormField>
          )}

          {/* 追加時のみ：招待メールの案内 */}
          {modal === "add" && (
            <div style={{background:C.infoBg, border:`1px solid ${C.info}`, borderLeft:`4px solid ${C.info}`, padding:"10px 14px", marginBottom:16}}>
              <p style={{margin:0, fontSize:13, color:C.info, lineHeight:"1.5"}}>
                ℹ　登録後、Supabase Auth よりユーザーへ招待メールが送信されます。
                ユーザーはメール内のリンクからパスワードを設定してログインできます。
              </p>
            </div>
          )}

          <div style={{display:"flex", gap:8, marginTop:8}}>
            <PrimaryBtn onClick={save}>保存する</PrimaryBtn>
            <SecondaryBtn onClick={closeModal}>キャンセル</SecondaryBtn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── ダッシュボード ─────────────────────────────────────────
function Dashboard({ customers, deals, brands, tasks, activities, users, currentRole }) {
  const activeTasks = tasks.filter(t=>!t.done)
  const overdue     = activeTasks.filter(t=>t.dueDate&&t.dueDate<todayS())
  const sc          = k => deals.filter(d=>d.stage===k).length
  const activeBrands = brands.filter(b=>b.contractStatus==="active").length
  const sorted      = [...activities].sort((a,b)=>{
    const da=(a.activityDate||"")+(a.activityTime||"")
    const db=(b.activityDate||"")+(b.activityTime||"")
    return db.localeCompare(da)
  })

  return (
    <div style={{padding:24}}>
      <PageHeader title="ダッシュボード" sub="2026年5月4日 月曜日" />
      {currentRole==="viewer" && <ReadonlyBanner />}

      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20}}>
        <KpiCard label="顧客数"       value={`${customers.length}社`}   sub="登録済み"                                                          accentColor="#4A4A4C" />
        <KpiCard label="掲載中ブランド" value={`${activeBrands}件`}      sub={`総ブランド ${brands.length}件`}                                   accentColor={C.primary} />
        <KpiCard label="進行中商談"   value={`${sc("proposal")+sc("negotiation")}件`} sub={`商談合計 ${deals.length}件`}                          accentColor={C.warning} />
        <KpiCard label="未完タスク"   value={`${activeTasks.length}件`} sub={overdue.length>0?`⚠ 期限超過 ${overdue.length}件`:"全て期限内"} accentColor={overdue.length>0?C.error:C.success} />
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16}}>
        <SectionBox title="商談パイプライン">
          {Object.entries(STAGE_CFG).map(([k,c])=>{
            const cnt=sc(k), total=deals.length||1
            return (
              <div key={k} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{fontSize:12,color:C.textSub,width:52,flexShrink:0}}>{c.label}</span>
                <div style={{flex:1,background:"#E4E4E4",height:4}}>
                  <div style={{width:`${(cnt/total)*100}%`,height:4,background:c.color,transition:"width 0.3s"}} />
                </div>
                <span style={{fontSize:13,fontWeight:700,color:C.text,width:20,textAlign:"right"}}>{cnt}</span>
              </div>
            )
          })}
        </SectionBox>
        <SectionBox title="未完タスク（直近）">
          {activeTasks.slice(0,5).map(t=>{
            const c=customers.find(c=>c.id===t.customerId)
            const over=t.dueDate&&t.dueDate<todayS()
            return (
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${C.divider}`}}>
                <div style={{width:4,flexShrink:0,alignSelf:"stretch",background:over?C.error:C.primary}} />
                <span style={{flex:1,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
                <span style={{fontSize:12,color:over?C.error:C.textMuted,fontWeight:over?700:400,whiteSpace:"nowrap"}}>{over?"⚠ ":""}{fmtD(t.dueDate)}</span>
              </div>
            )
          })}
        </SectionBox>
      </div>

      <SectionBox title="直近の活動">
        {sorted.slice(0,5).map(a=>{
          const c = customers.find(c=>c.id===a.customerId)
          const u = users.find(u=>u.id===a.assignedUserId)
          const tc = TYPE_CFG[a.type]
          return (
            <div key={a.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.divider}`}}>
              <StatusBadge cfg={{...tc,border:tc.color}} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.summary}</div>
                <div style={{fontSize:12,color:C.textMuted,marginTop:3}}>{c?.companyName}　{fmtD(a.activityDate)} {a.activityTime||""}{u?`　${u.name}`:""}</div>
              </div>
            </div>
          )
        })}
      </SectionBox>
    </div>
  )
}

// ─── 郵便番号検索フォーム ───────────────────────────────────
function PostalLookup({ form, setForm }) {
  const [zip,    setZip]    = useState(form.zip || "")
  const [status, setStatus] = useState(null) // null | "loading" | "ok" | "notfound" | "error"

  const lookup = async () => {
    const clean = zip.replace(/[^0-9]/g, "")
    if (clean.length !== 7) { setStatus("error"); return }
    setStatus("loading")
    try {
      const res  = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${clean}`)
      const data = await res.json()
      if (data.results) {
        const r = data.results[0]
        // address1=都道府県 address2=市区町村 address3=町域
        const autoAddress = `${r.address1}${r.address2}${r.address3}`
        setForm(p => ({
          ...p,
          zip:     clean,
          address: autoAddress,
        }))
        setZip(clean)
        setStatus("ok")
      } else {
        setStatus("notfound")
      }
    } catch {
      setStatus("error")
    }
  }

  const handleKey = e => { if (e.key === "Enter") { e.preventDefault(); lookup() } }

  const statusMsg = {
    loading:  { text:"検索中...",           color:C.textMuted },
    ok:       { text:"住所を自動入力しました", color:C.success  },
    notfound: { text:"該当する住所が見つかりませんでした", color:C.warning },
    error:    { text:"7桁の数字で入力してください",        color:C.error   },
  }

  return (
    <FormField label="郵便番号">
      <div style={{display:"flex", gap:8, alignItems:"flex-start"}}>
        {/* 入力欄 */}
        <div style={{flex:1}}>
          <div style={{display:"flex", alignItems:"center", gap:0}}>
            <span style={{
              padding:"8px 10px", fontSize:14, background:"#F5F5F5",
              border:`1px solid ${C.border}`, borderRight:"none",
              color:C.textMuted, lineHeight:"1.3", whiteSpace:"nowrap", flexShrink:0,
            }}>〒</span>
            <input
              type="text"
              value={zip}
              onChange={e => { setZip(e.target.value); setStatus(null) }}
              onKeyDown={handleKey}
              placeholder="1234567（ハイフン不要）"
              maxLength={8}
              style={{
                flex:1, padding:"8px 12px", fontSize:16,
                border:`1px solid ${C.border}`, borderRadius:0,
                background:C.bgWhite, color:C.text, outline:"none",
                fontFamily:"inherit", lineHeight:"1.3",
              }}
            />
          </div>
          {/* ステータスメッセージ */}
          {status && status !== "loading" && (
            <p style={{margin:"4px 0 0", fontSize:12, color:statusMsg[status].color, lineHeight:"1.3"}}>
              {statusMsg[status].text}
            </p>
          )}
        </div>
        {/* 検索ボタン */}
        <button
          onClick={lookup}
          disabled={status === "loading"}
          style={{
            padding:"8px 16px", fontSize:13, fontWeight:700,
            border:`1px solid ${C.primary}`, borderRadius:0,
            background: status==="loading" ? "#F0F0F0" : C.primary,
            color: status==="loading" ? C.textMuted : "#fff",
            cursor: status==="loading" ? "not-allowed" : "pointer",
            whiteSpace:"nowrap", fontFamily:"inherit", flexShrink:0,
            lineHeight:"1.5",
          }}
        >
          {status === "loading" ? "検索中" : "住所を検索"}
        </button>
      </div>
    </FormField>
  )
}

// ─── 顧客管理 ──────────────────────────────────────────────
const CUSTOMER_TABS = [
  { key:"company", label:"会社情報"   },
  { key:"address", label:"所在地"     },
  { key:"contact", label:"担当者情報" },
  { key:"billing", label:"請求先情報" },
  { key:"other",   label:"その他"     },
]

function CustomerFormTabs({ activeTab, setActiveTab }) {
  return (
    <div style={{display:"flex", borderBottom:`2px solid ${C.divider}`, marginBottom:20}}>
      {CUSTOMER_TABS.map(t => (
        <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
          padding:"8px 16px", fontSize:13, fontWeight:activeTab===t.key?700:400,
          border:"none", borderBottom:activeTab===t.key?`2px solid ${C.primary}`:"2px solid transparent",
          marginBottom:-2, background:"transparent", cursor:"pointer",
          color:activeTab===t.key?C.primary:C.textSub, fontFamily:"inherit", whiteSpace:"nowrap",
        }}>{t.label}</button>
      ))}
    </div>
  )
}

function Customers({ customers, setCustomers, brands, users, currentRole }) {
  const writable = can(currentRole, "write")
  const [modal,     setModal]     = useState(null)
  const [editId,    setEditId]    = useState(null)
  const [form,      setForm]      = useState({})
  const [activeTab, setActiveTab] = useState("company")
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}))

  const openAdd  = () => { setForm({}); setEditId(null); setActiveTab("company"); setModal("add") }
  const openEdit = c  => {
    if (!writable) return
    setForm({...c}); setEditId(c.id); setActiveTab("company"); setModal("edit")
  }
  const closeModal = () => { setModal(null); setEditId(null); setForm({}) }

  const save = () => {
    if (!form.companyName) return
    modal === "add"
      ? setCustomers(p => [...p, {id:mkId(), createdAt:todayS(), ...form}])
      : setCustomers(p => p.map(c => c.id === editId ? {...c, ...form} : c))
    closeModal()
  }
  const del = id => {
    if (confirm("削除しますか？")) { setCustomers(p => p.filter(c => c.id !== id)); closeModal() }
  }

  return (
    <div style={{padding:24}}>
      <PageHeader title="顧客管理" sub={`${customers.length}社登録済み`}
        action={writable ? <PrimaryBtn onClick={openAdd}>＋ 顧客を追加</PrimaryBtn> : null} />
      {!writable && <ReadonlyBanner />}

      <DataTable headers={["会社名","担当者名","電話番号","ブランド数","担当営業","登録日",""]}>
        {customers.map(c => {
          const brandCount = brands.filter(b=>b.customerId===c.id).length
          const assignedUser = users.find(u=>u.id===c.assignedUserId)
          return (
          <Tr key={c.id}>
            <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
              <div style={{fontSize:14, fontWeight:700, color:C.text}}>{c.companyName||"—"}</div>
              {c.companyNameKana && <div style={{fontSize:11, color:C.textMuted, marginTop:2}}>{c.companyNameKana}</div>}
            </td>
            <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
              <div style={{fontSize:13, color:C.text}}>{c.contactName||"—"}</div>
              {c.contactTitle && <div style={{fontSize:11, color:C.textMuted, marginTop:1}}>{c.contactTitle}</div>}
            </td>
            <Td>{c.phone||"—"}</Td>
            <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`, textAlign:"center"}}>
              <span style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                width:28, height:28, background: brandCount>0 ? C.primaryLight : "#F0F0F0",
                color: brandCount>0 ? C.primary : C.textMuted,
                fontSize:13, fontWeight:700,
              }}>{brandCount}</span>
            </td>
            <Td>{assignedUser?.name||"—"}</Td>
            <Td muted>{fmtD(c.createdAt)}</Td>
            <td style={{padding:"11px 16px", textAlign:"right", borderBottom:`1px solid ${C.divider}`}}>
              {writable && (
                <button onClick={() => openEdit(c)} style={{fontSize:13, color:C.primary, background:"none", border:"none", cursor:"pointer", padding:"4px 8px", fontWeight:700, textDecoration:"underline", fontFamily:"inherit"}}>
                  編集
                </button>
              )}
            </td>
          </Tr>
        )})}
      </DataTable>

      {/* タブ付きワイドモーダル */}
      {modal && (
        <div style={{position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(0,0,0,0.55)"}}>
          <div style={{background:C.bgWhite, width:"100%", maxWidth:680, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 8px 32px rgba(0,0,0,0.3)", borderTop:`3px solid ${C.primary}`}}>

            {/* ヘッダー */}
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${C.divider}`, flexShrink:0}}>
              <h3 style={{margin:0, fontSize:16, fontWeight:700, color:C.text}}>
                {modal === "add" ? "顧客を追加" : `顧客を編集：${form.companyName||""}`}
              </h3>
              <button onClick={closeModal} style={{background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.textMuted, lineHeight:1, padding:"0 4px"}}>×</button>
            </div>

            {/* タブ */}
            <div style={{flexShrink:0, padding:"0 20px"}}>
              <CustomerFormTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* スクロール領域 */}
            <div style={{flex:1, overflowY:"auto", padding:"0 20px 8px"}}>

              {activeTab === "company" && (
                <div>
                  <FormField label="会社ID（comp_id）">
                    <TextInput value={form.compId||""} onChange={f("compId")} placeholder="COMP-0001（自動採番も可）" />
                  </FormField>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <FormField label="会社名" required>
                      <TextInput value={form.companyName||""} onChange={f("companyName")} placeholder="株式会社〇〇" />
                    </FormField>
                    <FormField label="会社名フリガナ">
                      <TextInput value={form.companyNameKana||""} onChange={f("companyNameKana")} placeholder="カブシキガイシャ〇〇" />
                    </FormField>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <FormField label="法人番号">
                      <TextInput value={form.corporateNumber||""} onChange={f("corporateNumber")} placeholder="13桁の法人番号" maxLength={13} />
                    </FormField>
                    <FormField label="代表電話番号">
                      <TextInput value={form.phone||""} onChange={f("phone")} placeholder="03-0000-0000" />
                    </FormField>
                  </div>
                  <FormField label="会社サイトURL">
                    <TextInput type="url" value={form.siteUrl||""} onChange={f("siteUrl")} placeholder="https://example.co.jp" />
                  </FormField>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                    <FormField label="設立年月">
                      <TextInput type="month" value={form.foundedAt||""} onChange={f("foundedAt")} />
                    </FormField>
                    <FormField label="資本金（円）">
                      <TextInput type="number" value={form.capital||""} onChange={f("capital")} placeholder="10000000" />
                      {form.capital && <p style={{margin:"3px 0 0",fontSize:11,color:C.textMuted}}>{fmtNum(form.capital)} 円</p>}
                    </FormField>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <FormField label="代表者役職">
                      <TextInput value={form.ceoTitle||""} onChange={f("ceoTitle")} placeholder="代表取締役社長" />
                    </FormField>
                    <FormField label="代表者名">
                      <TextInput value={form.ceoName||""} onChange={f("ceoName")} placeholder="山田 太郎" />
                    </FormField>
                  </div>
                  <FormField label="事業内容">
                    <TextInput textarea value={form.business||""} onChange={f("business")} placeholder="主な事業内容を入力..." />
                  </FormField>
                </div>
              )}

              {activeTab === "address" && (
                <div>
                  <PostalLookup form={form} setForm={setForm} />
                  <FormField label="住所">
                    <TextInput value={form.address||""} onChange={f("address")} placeholder="都道府県・市区町村・町域（自動入力されます）" />
                  </FormField>
                  <FormField label="建物名・部屋番号">
                    <TextInput value={form.addressLine2||""} onChange={f("addressLine2")} placeholder="〇〇ビル 3F など" />
                  </FormField>
                </div>
              )}

              {activeTab === "contact" && (
                <div>
                  <div style={{background:C.infoBg, border:`1px solid ${C.info}`, borderLeft:`4px solid ${C.info}`, padding:"10px 14px", marginBottom:16}}>
                    <p style={{margin:0, fontSize:13, color:C.info, lineHeight:"1.5"}}>主な営業窓口となる担当者の情報を入力してください。</p>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                    <FormField label="部署名">
                      <TextInput value={form.contactDept||""} onChange={f("contactDept")} placeholder="営業部" />
                    </FormField>
                    <FormField label="役職">
                      <TextInput value={form.contactTitle||""} onChange={f("contactTitle")} placeholder="営業部長" />
                    </FormField>
                    <FormField label="氏名">
                      <TextInput value={form.contactName||""} onChange={f("contactName")} placeholder="田中 太郎" />
                    </FormField>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <FormField label="電話番号">
                      <TextInput value={form.contactPhone||""} onChange={f("contactPhone")} placeholder="03-0000-0000" />
                    </FormField>
                    <FormField label="メールアドレス">
                      <TextInput type="email" value={form.contactEmail||""} onChange={f("contactEmail")} placeholder="tanaka@example.co.jp" />
                    </FormField>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div>
                  <div style={{background:C.warningBg, border:`1px solid ${C.warning}`, borderLeft:`4px solid ${C.warning}`, padding:"10px 14px", marginBottom:16}}>
                    <p style={{margin:0, fontSize:13, color:C.warning, lineHeight:"1.5"}}>請求書の送付先担当者を入力してください。担当者と同じ場合は空欄で構いません。</p>
                  </div>

                  {/* 請求先担当者 */}
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                    <FormField label="部署名">
                      <TextInput value={form.billingDept||""} onChange={f("billingDept")} placeholder="経理部" />
                    </FormField>
                    <FormField label="役職">
                      <TextInput value={form.billingTitle||""} onChange={f("billingTitle")} placeholder="経理部長" />
                    </FormField>
                    <FormField label="氏名">
                      <TextInput value={form.billingName||""} onChange={f("billingName")} placeholder="田中 花子" />
                    </FormField>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <FormField label="電話番号">
                      <TextInput value={form.billingPhone||""} onChange={f("billingPhone")} placeholder="03-0000-0001" />
                    </FormField>
                    <FormField label="メールアドレス">
                      <TextInput type="email" value={form.billingEmail||""} onChange={f("billingEmail")} placeholder="billing@example.co.jp" />
                    </FormField>
                  </div>

                  {/* 請求条件 */}
                  <div style={{borderTop:`1px solid ${C.divider}`, margin:"8px 0 16px"}} />
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                    <FormField label="請求タイミング">
                      <TextInput select value={form.billingTiming||""} onChange={f("billingTiming")}>
                        <option value="">選択してください</option>
                        {BILLING_TIMING_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                      </TextInput>
                    </FormField>
                    <FormField label="入金予定月">
                      <TextInput select value={form.billingPaymentMonth||""} onChange={f("billingPaymentMonth")}>
                        <option value="">選択してください</option>
                        {BILLING_PAYMENT_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                      </TextInput>
                    </FormField>
                  </div>
                  <FormField label="請求書備考">
                    <TextInput textarea value={form.billingInvoiceNotes||""} onChange={f("billingInvoiceNotes")} placeholder="請求書に記載する備考（支払い条件など）" />
                  </FormField>
                  <FormField label="メモ">
                    <TextInput textarea value={form.billingMemo||""} onChange={f("billingMemo")} placeholder="社内用メモ（請求書には表示されません）" />
                  </FormField>
                </div>
              )}

              {activeTab === "other" && (
                <div>
                  <FormField label="担当営業">
                    <TextInput select value={form.assignedUserId||""} onChange={f("assignedUserId")}>
                      <option value="">未割り当て</option>
                      {users.filter(u=>u.active).map(u=>(
                        <option key={u.id} value={u.id}>{u.name}（{ROLES[u.role].label}）</option>
                      ))}
                    </TextInput>
                  </FormField>
                  {modal === "edit" && form.createdAt && (
                    <FormField label="登録日">
                      <div style={{padding:"8px 12px", background:"#F5F5F5", border:`1px solid ${C.border}`, fontSize:14, color:C.textSub}}>
                        {fmtD(form.createdAt)}　<span style={{fontSize:12, color:C.textMuted}}>自動設定（変更不可）</span>
                      </div>
                    </FormField>
                  )}
                  <FormField label="備考">
                    <TextInput textarea value={form.notes||""} onChange={f("notes")} />
                  </FormField>
                </div>
              )}
            </div>

            {/* フッター */}
            <div style={{flexShrink:0, padding:"12px 20px 20px", borderTop:`1px solid ${C.divider}`, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div style={{display:"flex", gap:8}}>
                <PrimaryBtn onClick={save}>保存する</PrimaryBtn>
                <SecondaryBtn onClick={closeModal}>キャンセル</SecondaryBtn>
              </div>
              {modal === "edit" && <DangerBtn onClick={() => del(editId)}>削除</DangerBtn>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ブランドのステージ完了度を計算
function calcStageProgress(b, c) {
  const results = STAGES.map(stage => {
    const filled = stage.fields.filter(key => {
      if (key in b) return b[key] && b[key] !== "未提出"
      if (c && key in c) return !!c[key]
      return false
    })
    return { ...stage, filled: filled.length, total: stage.fields.length, done: filled.length === stage.fields.length }
  })
  return results
}

// CSV出力（MF請求書インポート形式）
// ─── 郵便番号フォーマット（MF形式: 123-4567）─────────────────
const fmtZip = z => {
  const n = (z||"").replace(/[^0-9]/g,"")
  return n.length === 7 ? `${n.slice(0,3)}-${n.slice(3)}` : n
}

// ─── 住所から都道府県を分離 ───────────────────────────────────
const splitAddress = addr => {
  const m = (addr||"").match(/^(東京都|北海道|大阪府|京都府|.{2,3}[都道府県])(.*)$/)
  return m ? { pref: m[1], rest: m[2] } : { pref: "", rest: addr||"" }
}

// ─── MF請求書 CSV出力（実際のインポート形式に準拠）────────────
// 対象：掲載中（active）のブランドのみ
// 形式：MF請求書サンプルCSVに合わせたカラム順・フォーマット
function exportCSV(brands, customers, users) {
  const active = brands.filter(b => b.contractStatus === "active")

  const headers = [
    "顧客コード", "名称", "名称(カナ)", "敬称",
    "支払い期限(月)", "支払い期限(日)", "土日祝日",
    "郵便番号", "都道府県", "住所1", "住所2",
    "担当者部署", "担当者役職", "担当者氏名",
    "電話番号", "メールアドレス", "CCメールアドレス",
    "自社担当者名", "Peppol ID", "メモ",
  ]

  const rows = active.map(b => {
    const c    = customers.find(x => x.id === b.customerId) || {}
    const u    = users.find(x => x.id === b.assignedUserId) || {}
    const addr = splitAddress(c.address)

    // 請求先情報を優先、なければ担当者情報にフォールバック
    const contactDept  = c.billingDept  || c.contactDept  || ""
    const contactTitle = c.billingTitle || c.contactTitle || ""
    const contactName  = b.signerName  || c.billingName  || c.contactName  || ""
    const contactPhone = c.billingPhone|| c.phone        || ""
    const contactEmail = b.signerEmail || c.billingEmail || c.contactEmail || ""
    const ccEmail      = c.notifyEmail || ""

    // Peppol ID: 法人番号がある場合は "0088:{法人番号}" 形式
    const peppolId = c.corporateNumber ? `0088:${c.corporateNumber}` : ""

    // 顧客コード: 実運用ではMF側のコードを顧客DBに持たせると一致させやすい
    const customerCode = c.id.toUpperCase()

    return [
      customerCode,
      c.companyName||"",
      c.companyNameKana||"",
      "御中",           // 法人は固定で御中
      "翌月",           // 支払い期限(月)デフォルト
      "末日",           // 支払い期限(日)デフォルト
      "変更しない",     // 土日祝日デフォルト
      fmtZip(c.zip),
      addr.pref,
      addr.rest,
      "",               // 住所2（建物名は現DBから削除済み）
      contactDept,
      contactTitle,
      contactName,
      contactPhone,
      contactEmail,
      ccEmail,
      u.name||"",
      peppolId,
      c.notes||"",
    ]
  })

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))
    .join("\n")

  const blob = new Blob(["\uFEFF"+csv], { type:"text/csv;charset=utf-8;" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href = url
  a.download = `mf_取引先インポート_${todayS()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── 取り込み待ちモックデータ（Googleフォーム経由） ───────────
const STAGING_INIT = [
  {
    id:"s1", submittedAt:"2026-05-03T14:22:00", status:"pending",
    data:{
      companyName:"デルタ株式会社", companyNameKana:"デルタカブシキガイシャ",
      corporateNumber:"3456789012345", phone:"03-9999-0001",
      zip:"1500001", address:"東京都渋谷区神宮前1-1-1",
      ceoName:"木村 健一", ceoTitle:"代表取締役",
      contactTitle:"営業部長", contactName:"木村 幸子",
      contactPhone:"03-9999-0002", contactEmail:"kimura@delta.co.jp",
      billingTitle:"経理部長", billingName:"木村 幸子",
      billingPhone:"03-9999-0003", billingEmail:"billing@delta.co.jp",
      notes:"",
    },
  },
  {
    id:"s2", submittedAt:"2026-05-04T09:10:00", status:"pending",
    data:{
      companyName:"イプシロン商事", companyNameKana:"イプシロンショウジ",
      corporateNumber:"", phone:"06-8888-1234",
      zip:"5300003", address:"大阪府大阪市北区天満橋2-3-4",
      ceoName:"中島 良介", ceoTitle:"社長",
      contactTitle:"", contactName:"中島 恵",
      contactPhone:"06-8888-1235", contactEmail:"nakajima@epsilon.co.jp",
      billingTitle:"", billingName:"", billingPhone:"", billingEmail:"",
      notes:"資本金情報未記入",
    },
  },
]

// ─── ブランド管理 ──────────────────────────────────────────
function Brands({ brands, setBrands, customers, users, plans, currentRole }) {
  const writable = can(currentRole, "write")
  const [modal,  setModal]  = useState(null)
  const [editId, setEditId] = useState(null)
  const [form,   setForm]   = useState({})
  const [filterCustomer, setFilterCustomer] = useState("")
  const f = k => e => setForm(p => ({...p, [k]: e.target.value}))

  // プラン選択時に月額利用料を自動セット
  const onPlanChange = e => {
    const planName = e.target.value
    const selected = plans.find(p => p.name === planName)
    setForm(p => ({
      ...p,
      plan: planName,
      monthlyFee: selected?.monthlyFee || p.monthlyFee || "",
    }))
  }

  const openAdd  = () => {
    setForm({ contractTerm: DEFAULT_CONTRACT_TERM })  // 契約期間は6ヶ月がデフォルト
    setEditId(null); setModal("add")
  }
  const openEdit = b  => { if (!writable) return; setForm({...b}); setEditId(b.id); setModal("edit") }
  const closeModal = () => { setModal(null); setEditId(null); setForm({}) }
  const save = () => {
    if (!form.brandName || !form.customerId) return
    modal === "add"
      ? setBrands(p => [...p, {id:mkId(), createdAt:todayS(), ...form}])
      : setBrands(p => p.map(b => b.id === editId ? {...b, ...form} : b))
    closeModal()
  }
  const del = id => {
    if (confirm("削除しますか？")) { setBrands(p => p.filter(b => b.id !== id)); closeModal() }
  }

  const filtered = filterCustomer
    ? brands.filter(b => b.customerId === filterCustomer)
    : brands

  return (
    <div style={{padding:24}}>
      <PageHeader title="ブランド管理" sub={`${brands.length}件登録`}
        action={
          <div style={{display:"flex", gap:8}}>
            <SecondaryBtn onClick={()=>exportCSV(brands,customers,users)}>
              CSV出力（MF請求書用）
            </SecondaryBtn>
            {writable && <PrimaryBtn onClick={openAdd}>＋ ブランドを追加</PrimaryBtn>}
          </div>
        } />
      {!writable && <ReadonlyBanner />}

      {/* 会社フィルター */}
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
        <label style={{fontSize:13, fontWeight:700, color:C.textSub, whiteSpace:"nowrap"}}>会社で絞り込み：</label>
        <select value={filterCustomer} onChange={e=>setFilterCustomer(e.target.value)}
          style={{padding:"6px 12px", fontSize:13, border:`1px solid ${C.border}`, background:C.bgWhite, color:C.text, fontFamily:"inherit", cursor:"pointer", minWidth:200}}>
          <option value="">すべて</option>
          {customers.map(c=><option key={c.id} value={c.id}>{c.companyName}</option>)}
        </select>
        <span style={{fontSize:12, color:C.textMuted}}>{filtered.length}件</span>
      </div>

      <DataTable headers={["ブランド名","会社名","ステータス","承認","書類","プラン","月額","次回更新日","担当営業",""]}>
        {filtered.map(b => {
          const c  = customers.find(c=>c.id===b.customerId)
          const u  = users.find(u=>u.id===b.assignedUserId)
          const sc = BRAND_STATUS_CFG[b.contractStatus] || BRAND_STATUS_CFG.negotiating
          const ac = APPROVAL_STATUS_CFG[b.approvalStatus||"none"]
          const docCount    = DOC_TYPES.filter(d => b[d.key]==="承認済み").length
          const docTotal    = DOC_TYPES.length
          const docAllDone  = docCount === docTotal
          const docHasPending = DOC_TYPES.some(d => b[d.key]==="提出済み"||b[d.key]==="確認中")
          return (
            <Tr key={b.id}>
              <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
                <div style={{fontSize:14, fontWeight:700, color:C.text}}>{b.brandName}</div>
                <div style={{fontSize:11, color:C.textMuted, marginTop:2}}>登録日 {fmtD(b.createdAt)}</div>
              </td>
              <Td>{c?.companyName||"—"}</Td>
              <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
                <StatusBadge cfg={sc} />
              </td>
              <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`}}>
                <StatusBadge cfg={ac} />
              </td>
              <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`, whiteSpace:"nowrap"}}>
                <span style={{
                  fontSize:12, fontWeight:700,
                  color: docAllDone ? C.success : docHasPending ? C.warning : C.textMuted,
                }}>
                  {docCount}/{docTotal}
                  {docAllDone ? " ✓" : ""}
                </span>
              </td>
              <Td>{b.plan||"—"}</Td>
              <td style={{padding:"11px 16px", fontSize:14, fontWeight:700, color:C.text, borderBottom:`1px solid ${C.divider}`, whiteSpace:"nowrap"}}>
                {b.monthlyFee ? fmt(b.monthlyFee) : "—"}
              </td>
              <td style={{padding:"11px 16px", borderBottom:`1px solid ${C.divider}`, whiteSpace:"nowrap"}}>
                {b.nextRenewalDate ? (
                  <span style={{
                    color: b.nextRenewalDate < todayS() ? C.error
                         : b.nextRenewalDate < new Date(Date.now()+30*86400000).toISOString().slice(0,10) ? C.warning
                         : C.textSub,
                    fontWeight: b.nextRenewalDate < new Date(Date.now()+30*86400000).toISOString().slice(0,10) ? 700 : 400,
                    fontSize:13,
                  }}>
                    {fmtD(b.nextRenewalDate)}
                    {b.nextRenewalDate < new Date(Date.now()+30*86400000).toISOString().slice(0,10) && " ⚠"}
                  </span>
                ) : "—"}
              </td>
              <Td>{u?.name||"—"}</Td>
              <td style={{padding:"11px 16px", textAlign:"right", borderBottom:`1px solid ${C.divider}`}}>
                {writable && (
                  <button onClick={()=>openEdit(b)} style={{fontSize:13, color:C.primary, background:"none", border:"none", cursor:"pointer", padding:"4px 8px", fontWeight:700, textDecoration:"underline", fontFamily:"inherit"}}>
                    編集
                  </button>
                )}
              </td>
            </Tr>
          )
        })}
      </DataTable>

      {/* モーダル */}
      {modal && (
        <div style={{position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(0,0,0,0.55)"}}>
          <div style={{background:C.bgWhite, width:"100%", maxWidth:620, maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:"0 8px 32px rgba(0,0,0,0.3)", borderTop:`3px solid ${C.primary}`}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${C.divider}`, flexShrink:0}}>
              <h3 style={{margin:0, fontSize:16, fontWeight:700, color:C.text}}>
                {modal==="add" ? "ブランドを追加" : `ブランドを編集：${form.brandName||""}`}
              </h3>
              <button onClick={closeModal} style={{background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.textMuted, lineHeight:1, padding:"0 4px"}}>×</button>
            </div>

            <div style={{flex:1, overflowY:"auto", padding:"20px"}}>

              {/* 基本情報 */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", marginBottom:12, paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>基本情報</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="チェーンID（chain_id）">
                  <TextInput value={form.chainId||""} onChange={f("chainId")} placeholder="CHAIN-0001" />
                </FormField>
                <FormField label="ブランド名" required>
                  <TextInput value={form.brandName||""} onChange={f("brandName")} placeholder="〇〇FC" />
                </FormField>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="会社名" required>
                  <TextInput select value={form.customerId||""} onChange={f("customerId")}>
                    <option value="">選択してください</option>
                    {customers.map(c=><option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </TextInput>
                </FormField>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="契約ステータス">
                  <TextInput select value={form.contractStatus||"negotiating"} onChange={f("contractStatus")}>
                    {Object.entries(BRAND_STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </TextInput>
                </FormField>
                <FormField label="担当営業">
                  <TextInput select value={form.assignedUserId||""} onChange={f("assignedUserId")}>
                    <option value="">未割り当て</option>
                    {users.filter(u=>u.active).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                  </TextInput>
                </FormField>
              </div>

              {/* 契約情報 */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", margin:"16px 0 12px", paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>契約情報</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                <FormField label="利用プラン">
                  <TextInput select value={form.plan||""} onChange={onPlanChange}>
                    <option value="">選択</option>
                    {plans.map(p=><option key={p.id} value={p.name}>{p.name}（{fmt(p.monthlyFee)}/月）</option>)}
                  </TextInput>
                </FormField>
                <FormField label="月額利用料（円）">
                  <TextInput type="number" value={form.monthlyFee||""} onChange={f("monthlyFee")} placeholder="100000" />
                  {form.monthlyFee && <p style={{margin:"3px 0 0", fontSize:11, color:C.textMuted}}>{fmt(form.monthlyFee)}</p>}
                </FormField>
                <FormField label="契約期間">
                  <TextInput select value={form.contractTerm||""} onChange={f("contractTerm")}>
                    <option value="">選択</option>
                    {CONTRACT_TERM_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
                  </TextInput>
                </FormField>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                <FormField label="契約開始日">
                  <TextInput type="date" value={form.contractStartDate||""} onChange={f("contractStartDate")} />
                </FormField>
                <FormField label="次回更新日">
                  <TextInput type="date" value={form.nextRenewalDate||""} onChange={f("nextRenewalDate")} />
                </FormField>
                <FormField label="請求パターン">
                  <TextInput select value={form.billingPattern||""} onChange={f("billingPattern")}>
                    <option value="">選択</option>
                    {BILLING_PATTERN_OPTIONS.map(p=><option key={p} value={p}>{p}</option>)}
                  </TextInput>
                </FormField>
              </div>

              {/* 通知・書類リンク */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", margin:"16px 0 12px", paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>通知・書類リンク</div>
              <FormField label="資料請求通知先メール">
                <TextInput type="email" value={form.notifyEmail||""} onChange={f("notifyEmail")} placeholder="info@example.co.jp" />
              </FormField>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="審査書類フォルダ（Drive URL）">
                  <TextInput type="url" value={form.docsFolderUrl||""} onChange={f("docsFolderUrl")} placeholder="https://drive.google.com/..." />
                </FormField>
                <FormField label="見積書URL（MF請求書）">
                  <TextInput type="url" value={form.quotationUrl||""} onChange={f("quotationUrl")} placeholder="https://invoice.moneyforward.com/..." />
                </FormField>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="申込書URL（クラウドサイン）">
                  <TextInput type="url" value={form.applicationUrl||""} onChange={f("applicationUrl")} placeholder="https://..." />
                </FormField>
                <FormField label="請求書URL（MF請求書）">
                  <TextInput type="url" value={form.invoiceUrl||""} onChange={f("invoiceUrl")} placeholder="https://invoice.moneyforward.com/..." />
                </FormField>
              </div>

              {/* クラウドサイン署名者 */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", margin:"16px 0 12px", paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>クラウドサイン署名者</div>
              <div style={{background:C.infoBg, border:`1px solid ${C.info}`, borderLeft:`4px solid ${C.info}`, padding:"8px 12px", marginBottom:12}}>
                <p style={{margin:0, fontSize:12, color:C.info, lineHeight:"1.5"}}>担当者と異なる場合に設定してください。担当者情報は会社DBから参照されます。</p>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="署名者_氏名">
                  <TextInput value={form.signerName||""} onChange={f("signerName")} placeholder="田中 太郎" />
                </FormField>
                <FormField label="署名者_メールアドレス">
                  <TextInput type="email" value={form.signerEmail||""} onChange={f("signerEmail")} placeholder="tanaka@example.co.jp" />
                </FormField>
              </div>

              {/* 見積承認 */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", margin:"16px 0 12px", paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>見積承認</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12}}>
                <FormField label="承認ステータス">
                  <TextInput select value={form.approvalStatus||"none"} onChange={f("approvalStatus")}>
                    {Object.entries(APPROVAL_STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </TextInput>
                </FormField>
                <FormField label="承認日">
                  <TextInput type="date" value={form.approvalDate||""} onChange={f("approvalDate")} />
                </FormField>
                <FormField label="SlackスレッドURL">
                  <TextInput type="url" value={form.approvalSlackUrl||""} onChange={f("approvalSlackUrl")} placeholder="https://slack.com/..." />
                </FormField>
              </div>

              {/* 審査書類チェックリスト */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", margin:"16px 0 12px", paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>審査書類チェックリスト</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8}}>
                {DOC_TYPES.map(doc => (
                  <div key={doc.key} style={{display:"flex", alignItems:"center", gap:8, padding:"8px 10px", border:`1px solid ${C.border}`, background:C.bgWhite}}>
                    <div style={{flex:1, fontSize:13, fontWeight:600, color:C.text}}>{doc.label}</div>
                    <select
                      value={form[doc.key]||"未提出"}
                      onChange={e => setForm(p=>({...p, [doc.key]:e.target.value}))}
                      style={{
                        fontSize:12, fontWeight:700, padding:"3px 6px",
                        border:`1px solid ${C.border}`, cursor:"pointer",
                        fontFamily:"inherit", background:C.bgWhite,
                        color: form[doc.key]==="承認済み" ? C.success
                             : form[doc.key]==="確認中"   ? C.warning
                             : form[doc.key]==="提出済み" ? C.info
                             : C.textMuted,
                      }}
                    >
                      {DOC_STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* 備考 */}
              <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", margin:"16px 0 12px", paddingBottom:6, borderBottom:`1px solid ${C.divider}`}}>備考</div>
              <FormField label="備考">
                <TextInput textarea value={form.notes||""} onChange={f("notes")} />
              </FormField>
              {modal==="edit" && form.createdAt && (
                <div style={{fontSize:12, color:C.textMuted, marginTop:4}}>登録日：{fmtD(form.createdAt)}</div>
              )}
            </div>

            <div style={{flexShrink:0, padding:"12px 20px 20px", borderTop:`1px solid ${C.divider}`, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div style={{display:"flex", gap:8}}>
                <PrimaryBtn onClick={save}>保存する</PrimaryBtn>
                <SecondaryBtn onClick={closeModal}>キャンセル</SecondaryBtn>
              </div>
              {modal==="edit" && <DangerBtn onClick={()=>del(editId)}>削除</DangerBtn>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
function DealCard({ d, c, u, cfg, writable, onEdit }) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={()=>writable&&onEdit()}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:C.bgWhite,
        border:`1px solid ${hov&&writable?cfg.color:C.border}`,
        borderLeft:`3px solid ${cfg.color}`,
        padding:"12px", cursor:writable?"pointer":"default",
        transition:"border-color 0.1s",
      }}>
      <div style={{fontSize:13, fontWeight:700, color:C.text, marginBottom:3}}>{c?.companyName||"—"}</div>
      {d.proposedPlan && <div style={{fontSize:11, color:C.info, marginBottom:4}}>{d.proposedPlan}</div>}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6}}>
        <span style={{fontSize:11, color:C.textMuted}}>{fmtD(d.actionDate)} {d.actionTime||""}</span>
        {u && <span style={{fontSize:11, color:C.textSub}}>{u.name}</span>}
      </div>
    </div>
  )
}

// ─── 日付・時間入力 共通コンポーネント ────────────────────────
function DateTimeFields({ dateVal, timeVal, onDateChange, onTimeChange, dateLabel="日付", timeLabel="時間" }) {
  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
      <FormField label={dateLabel}>
        <TextInput type="date" value={dateVal||""} onChange={onDateChange} />
      </FormField>
      <FormField label={timeLabel}>
        <TextInput select value={timeVal||""} onChange={onTimeChange}>
          <option value="">選択</option>
          {TIME_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
        </TextInput>
      </FormField>
    </div>
  )
}

// ─── 商談管理 ──────────────────────────────────────────────
function Deals({ deals, setDeals, setTasks, customers, brands, plans, users, currentRole }) {
  const writable = can(currentRole,"write")
  const [modal,  setModal]  = useState(null)
  const [editId, setEditId] = useState(null)
  const [form,   setForm]   = useState({})
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))

  const openAdd  = () => { setForm({stage:"prospecting", actionDate:todayS(), actionTime:"10:00"}); setEditId(null); setModal("add") }
  const openEdit = d  => { if(!writable)return; setForm({...d}); setEditId(d.id); setModal("edit") }
  const closeModal = () => { setModal(null); setEditId(null); setForm({}) }

  const save = () => {
    if (!form.customerId) return
    // 次回アクションがあればタスクに追加
    if (form.nextAction?.trim()) {
      setTasks(p=>[...p,{
        id:mkId(), title:form.nextAction.trim(),
        customerId:form.customerId, dueDate:form.actionDate||todayS(),
        done:false, assignedUserId:form.assignedUserId||"",
      }])
    }
    const saveData = {...form, nextAction:""}  // 保存後にnextActionをリセット
    modal==="add"
      ? setDeals(p=>[...p,{id:mkId(),...saveData}])
      : setDeals(p=>p.map(d=>d.id===editId?{...d,...saveData}:d))
    closeModal()
  }
  const del = id => { if(confirm("削除しますか？")){ setDeals(p=>p.filter(d=>d.id!==id)); closeModal() } }

  return (
    <div style={{padding:24}}>
      <PageHeader title="商談管理" sub={`${deals.length}件`}
        action={writable ? <PrimaryBtn onClick={openAdd}>＋ 商談を追加</PrimaryBtn> : null} />
      {!writable && <ReadonlyBanner />}

      {/* カンバン */}
      <div style={{display:"flex", gap:12, overflowX:"auto", paddingBottom:8}}>
        {Object.entries(STAGE_CFG).map(([stageKey,cfg])=>{
          const sd = deals.filter(d=>d.stage===stageKey)
          return (
            <div key={stageKey} style={{flexShrink:0, width:200}}>
              <div style={{background:cfg.bg, borderTop:`3px solid ${cfg.color}`, border:`1px solid ${C.border}`, padding:"8px 12px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                <div style={{display:"flex", alignItems:"center", gap:6}}>
                  <span style={{fontSize:13, fontWeight:700, color:cfg.color}}>{cfg.label}</span>
                  <span style={{fontSize:11, fontWeight:700, background:cfg.color, color:"#fff", padding:"1px 6px", lineHeight:"1.4"}}>{sd.length}</span>
                </div>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                {sd.map(d=>{
                  const c  = customers.find(c=>c.id===d.customerId)
                  const u  = users.find(u=>u.id===d.assignedUserId)
                  return (
                    <DealCard key={d.id} d={d} c={c} u={u} cfg={cfg} writable={writable} onEdit={()=>openEdit(d)} />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* モーダル */}
      {modal && writable && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"rgba(0,0,0,0.55)"}}>
          <div style={{background:C.bgWhite,width:"100%",maxWidth:560,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 8px 32px rgba(0,0,0,0.3)",borderTop:`3px solid ${C.primary}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:`1px solid ${C.divider}`,flexShrink:0}}>
              <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.text}}>{modal==="add"?"商談を追加":"商談を編集"}</h3>
              <button onClick={closeModal} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.textMuted,lineHeight:1,padding:"0 4px"}}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="顧客" required>
                  <TextInput select value={form.customerId||""} onChange={f("customerId")}>
                    <option value="">選択してください</option>
                    {customers.map(c=><option key={c.id} value={c.id}>{c.companyName}</option>)}
                  </TextInput>
                </FormField>
                <FormField label="ステージ">
                  <TextInput select value={form.stage||"prospecting"} onChange={f("stage")}>
                    {Object.entries(STAGE_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </TextInput>
                </FormField>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
                <FormField label="担当">
                  <TextInput select value={form.assignedUserId||""} onChange={f("assignedUserId")}>
                    <option value="">未割り当て</option>
                    {users.filter(u=>u.active).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                  </TextInput>
                </FormField>
                <FormField label="提案プラン">
                  <TextInput select value={form.proposedPlan||""} onChange={f("proposedPlan")}>
                    <option value="">選択</option>
                    {plans.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                  </TextInput>
                </FormField>
              </div>
              <DateTimeFields
                dateVal={form.actionDate} timeVal={form.actionTime}
                onDateChange={f("actionDate")} onTimeChange={f("actionTime")}
                dateLabel="対応日" timeLabel="対応時間"
              />
              <FormField label="関連ブランド">
                <TextInput select value={form.brandId||""} onChange={f("brandId")}>
                  <option value="">なし</option>
                  {brands.filter(b=>!form.customerId||b.customerId===form.customerId).map(b=><option key={b.id} value={b.id}>{b.brandName}</option>)}
                </TextInput>
              </FormField>
              <FormField label="議事録URL（Google Docs等）">
                <TextInput type="url" value={form.minutesUrl||""} onChange={f("minutesUrl")} placeholder="https://docs.google.com/..." />
              </FormField>
              <FormField label="メモ">
                <TextInput textarea value={form.notes||""} onChange={f("notes")} />
              </FormField>
              <div style={{borderTop:`1px solid ${C.divider}`, margin:"8px 0 16px"}} />
              <FormField label="次回アクション">
                <TextInput value={form.nextAction||""} onChange={f("nextAction")} placeholder="入力するとタスクに自動追加されます" />
              </FormField>
              {form.nextAction?.trim() && (
                <div style={{background:C.infoBg, border:`1px solid ${C.info}`, borderLeft:`4px solid ${C.info}`, padding:"8px 12px", marginTop:-8, marginBottom:12}}>
                  <p style={{margin:0, fontSize:12, color:C.info}}>保存時に「{form.nextAction}」がタスクに追加されます</p>
                </div>
              )}
            </div>
            <div style={{flexShrink:0,padding:"12px 20px 20px",borderTop:`1px solid ${C.divider}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:8}}>
                <PrimaryBtn onClick={save}>保存する</PrimaryBtn>
                <SecondaryBtn onClick={closeModal}>キャンセル</SecondaryBtn>
              </div>
              {modal==="edit" && <DangerBtn onClick={()=>del(editId)}>削除</DangerBtn>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 活動履歴 ──────────────────────────────────────────────
function Activities({ activities, setActivities, customers, deals, users, currentRole }) {
  const writable = can(currentRole,"write")
  const [modal, setModal] = useState(false)
  const [form,  setForm]  = useState({})
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))

  const openAdd = () => { setForm({type:"call", activityDate:todayS(), activityTime:"10:00"}); setModal(true) }
  const save = () => {
    if (!form.summary||!form.customerId) return
    setActivities(p=>[...p,{id:mkId(),...form}])
    setModal(false)
  }
  const sorted = [...activities].sort((a,b)=>{
    const da = (a.activityDate||"")+(a.activityTime||"")
    const db = (b.activityDate||"")+(b.activityTime||"")
    return db.localeCompare(da)
  })

  return (
    <div style={{padding:24}}>
      <PageHeader title="活動履歴" sub={`${activities.length}件`}
        action={writable ? <PrimaryBtn onClick={openAdd}>＋ 活動を記録</PrimaryBtn> : null} />
      {!writable && <ReadonlyBanner />}
      <DataTable headers={["種別","日付","時間","顧客","内容","担当","関連商談"]}>
        {sorted.map(a=>{
          const c  = customers.find(c=>c.id===a.customerId)
          const d  = deals.find(d=>d.id===a.dealId)
          const u  = users.find(u=>u.id===a.assignedUserId)
          const tc = TYPE_CFG[a.type]
          return (
            <Tr key={a.id}>
              <Td><StatusBadge cfg={{...tc, border:tc.color}} /></Td>
              <Td>{fmtD(a.activityDate)}</Td>
              <Td>{a.activityTime||"—"}</Td>
              <td style={{padding:"11px 16px", fontSize:14, color:C.text, fontWeight:700, borderBottom:`1px solid ${C.divider}`}}>
                {c?.companyName}
              </td>
              <td style={{padding:"11px 16px", fontSize:14, color:C.textSub, borderBottom:`1px solid ${C.divider}`, maxWidth:220}}>
                <div style={{overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{a.summary}</div>
              </td>
              <Td>{u?.name||"—"}</Td>
              <Td>{d ? `${customers.find(c=>c.id===d.customerId)?.companyName||""}` : "—"}</Td>
            </Tr>
          )
        })}
      </DataTable>
      {modal && (
        <Modal title="活動を記録" onClose={()=>setModal(false)}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <FormField label="種別">
              <TextInput select value={form.type} onChange={f("type")}>
                {Object.entries(TYPE_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </TextInput>
            </FormField>
            <FormField label="担当">
              <TextInput select value={form.assignedUserId||""} onChange={f("assignedUserId")}>
                <option value="">未割り当て</option>
                {users.filter(u=>u.active).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
              </TextInput>
            </FormField>
          </div>
          <DateTimeFields
            dateVal={form.activityDate} timeVal={form.activityTime}
            onDateChange={f("activityDate")} onTimeChange={f("activityTime")}
            dateLabel="日付" timeLabel="時間"
          />
          <FormField label="顧客" required>
            <TextInput select value={form.customerId||""} onChange={f("customerId")}>
              <option value="">選択してください</option>
              {customers.map(c=><option key={c.id} value={c.id}>{c.companyName}</option>)}
            </TextInput>
          </FormField>
          <FormField label="関連商談">
            <TextInput select value={form.dealId||""} onChange={f("dealId")}>
              <option value="">なし</option>
              {deals.filter(d=>!form.customerId||d.customerId===form.customerId).map(d=>{
                const c=customers.find(c=>c.id===d.customerId)
                return <option key={d.id} value={d.id}>{c?.companyName} {fmtD(d.actionDate)}</option>
              })}
            </TextInput>
          </FormField>
          <FormField label="活動内容" required><TextInput textarea value={form.summary||""} onChange={f("summary")} /></FormField>
          <div style={{display:"flex", gap:8, marginTop:8}}>
            <PrimaryBtn onClick={save}>保存する</PrimaryBtn>
            <SecondaryBtn onClick={()=>setModal(false)}>キャンセル</SecondaryBtn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── タスク ─────────────────────────────────────────────────
function Tasks({ tasks, setTasks, customers, users, currentRole }) {
  const writable = can(currentRole,"write")
  const [modal, setModal] = useState(false)
  const [form,  setForm]  = useState({})
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}))
  const toggle = id => { if(writable) setTasks(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t)) }
  const save = () => {
    if (!form.title) return
    setTasks(p=>[...p,{id:mkId(),done:false,...form}])
    setModal(false)
  }
  const active = tasks.filter(t=>!t.done).sort((a,b)=>(a.dueDate||"9999").localeCompare(b.dueDate||"9999"))
  const done   = tasks.filter(t=>t.done)

  return (
    <div style={{padding:24}}>
      <PageHeader title="タスク" sub={`未完 ${active.length}件　完了 ${done.length}件`}
        action={writable ? <PrimaryBtn onClick={()=>{setForm({dueDate:todayS()});setModal(true)}}>＋ タスクを追加</PrimaryBtn> : null} />
      {!writable && <ReadonlyBanner />}
      <div style={{marginBottom:24}}>
        {active.map(t=>{
          const c = customers.find(c=>c.id===t.customerId)
          const u = users.find(u=>u.id===t.assignedUserId)
          const over = t.dueDate&&t.dueDate<todayS()
          return (
            <div key={t.id} style={{display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.bgWhite, border:`1px solid ${C.border}`, borderLeft:`4px solid ${over?C.error:C.primary}`, marginBottom:4}}>
              <input type="checkbox" checked={false} onChange={()=>toggle(t.id)}
                disabled={!writable}
                style={{width:16, height:16, cursor:writable?"pointer":"not-allowed", accentColor:C.primary, flexShrink:0}} />
              <div style={{flex:1}}>
                <div style={{fontSize:14, fontWeight:700, color:C.text}}>{t.title}</div>
                {c && <div style={{fontSize:12, color:C.textMuted, marginTop:2}}>{c.companyName}</div>}
              </div>
              {u && <span style={{fontSize:12, color:C.textSub, whiteSpace:"nowrap"}}>{u.name}</span>}
              {t.dueDate && (
                <div style={{fontSize:12, fontWeight:700, padding:"4px 10px", color:over?C.error:C.textSub, background:over?C.errorBg:"#F0F0F0", border:`1px solid ${over?C.error:C.border}`, whiteSpace:"nowrap"}}>
                  {over?"⚠ ":""}{fmtD(t.dueDate)}
                </div>
              )}
            </div>
          )
        })}
      </div>
      {done.length>0 && (
        <>
          <div style={{fontSize:12, fontWeight:700, color:C.textMuted, letterSpacing:"0.08em", marginBottom:8, borderTop:`1px solid ${C.divider}`, paddingTop:16}}>完了済み</div>
          {done.map(t=>{
            const u=users.find(u=>u.id===t.assignedUserId)
            return (
              <div key={t.id} style={{display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:"#F5F5F5", border:`1px solid ${C.divider}`, borderLeft:`4px solid ${C.border}`, marginBottom:4, opacity:0.6}}>
                <input type="checkbox" checked onChange={()=>toggle(t.id)} disabled={!writable} style={{width:16, height:16, cursor:writable?"pointer":"not-allowed", accentColor:C.primary, flexShrink:0}} />
                <span style={{flex:1, fontSize:14, color:C.textMuted, textDecoration:"line-through"}}>{t.title}</span>
                {u && <span style={{fontSize:12, color:C.textMuted}}>{u.name}</span>}
              </div>
            )
          })}
        </>
      )}
      {modal && (
        <Modal title="タスクを追加" onClose={()=>setModal(false)}>
          <FormField label="タスク名" required><TextInput value={form.title||""} onChange={f("title")} /></FormField>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <FormField label="関連顧客">
              <TextInput select value={form.customerId||""} onChange={f("customerId")}>
                <option value="">なし</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.companyName}</option>)}
              </TextInput>
            </FormField>
            <FormField label="担当">
              <TextInput select value={form.assignedUserId||""} onChange={f("assignedUserId")}>
                <option value="">未割り当て</option>
                {users.filter(u=>u.active).map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
              </TextInput>
            </FormField>
          </div>
          <FormField label="期限"><TextInput type="date" value={form.dueDate||""} onChange={f("dueDate")} /></FormField>
          <div style={{display:"flex", gap:8, marginTop:8}}>
            <PrimaryBtn onClick={save}>保存する</PrimaryBtn>
            <SecondaryBtn onClick={()=>setModal(false)}>キャンセル</SecondaryBtn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── メインアプリ ───────────────────────────────────────────
export default function App() {
  // モック用：ログインユーザーを切り替えて権限テストができる
  const [currentUserId, setCurrentUserId] = useState("u1")
  const [view, setView]             = useState("dashboard")
  const [users, setUsers]           = useState(USERS_INIT)
  const [customers, setCustomers]   = useState(CUSTOMERS_INIT)
  const [staging,   setStaging]     = useState(STAGING_INIT)
  const [brands,    setBrands]      = useState(BRANDS_INIT)
  const [plans,     setPlans]       = useState(PLANS_INIT)
  const [deals,     setDeals]       = useState(DEALS_INIT)
  const [activities,setActivities]  = useState(ACTIVITIES_INIT)
  const [tasks,     setTasks]       = useState(TASKS_INIT)

  const currentUser = users.find(u=>u.id===currentUserId) || users[0]
  const currentRole = currentUser.role

  // ユーザー切り替えでviewをリセット（権限外のページにいた場合）
  const handleUserSwitch = (userId) => {
    const u = users.find(x=>x.id===userId)
    setCurrentUserId(userId)
    if (u?.role !== "admin" && view === "users") setView("dashboard")
  }

  const p = { customers, setCustomers, staging, setStaging, brands, setBrands, plans, setPlans, deals, setDeals, activities, setActivities, tasks, setTasks, users, currentRole }

  const visibleNav = NAV_ITEMS.filter(n=>n.roles.includes(currentRole))

  return (
    <div style={{display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'Noto Sans JP',-apple-system,BlinkMacSystemFont,'Hiragino Kaku Gothic ProN','Meiryo',sans-serif", background:C.bg, color:C.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
        * { box-sizing:border-box; }
        button:focus,input:focus,select:focus,textarea:focus { outline:2px solid #0064D9; outline-offset:1px; }
        ::-webkit-scrollbar{width:6px;height:6px;}
        ::-webkit-scrollbar-track{background:#F5F5F5;}
        ::-webkit-scrollbar-thumb{background:#C9C9C9;}
      `}</style>

      {/* サイドバー */}
      <aside style={{width:200, background:C.sidebarBg, display:"flex", flexDirection:"column", flexShrink:0, borderRight:"1px solid #000"}}>
        <div style={{padding:"20px 16px", borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontSize:11, fontWeight:700, color:C.primary, letterSpacing:"0.12em"}}>SALES TOOL</div>
          <div style={{fontSize:11, color:"#595959", marginTop:4, letterSpacing:"0.04em"}}>モックプレビュー版</div>
        </div>

        <nav style={{flex:1, padding:"8px 0"}}>
          {visibleNav.map(n=>{
            const active=view===n.key
            return (
              <button key={n.key} onClick={()=>setView(n.key)} style={{
                display:"flex", alignItems:"center", width:"100%",
                padding:"11px 16px", fontSize:13, fontWeight:active?700:400,
                letterSpacing:"0.02em", lineHeight:"1",
                border:"none", borderLeft:active?`3px solid ${C.primary}`:"3px solid transparent",
                background:active?C.sidebarHover:"transparent",
                color:active?C.sidebarActive:n.key==="users"?"#E8B4B8":C.sidebarText,
                cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                transition:"background 0.1s, color 0.1s",
              }}>
                {n.label}
                {n.key==="staging" && staging.filter(s=>s.status==="pending").length > 0 && (
                  <span style={{marginLeft:"auto", fontSize:10, fontWeight:700, background:C.warning, color:"#fff", padding:"1px 5px", lineHeight:"1.4"}}>
                    {staging.filter(s=>s.status==="pending").length}
                  </span>
                )}
                {(n.key==="users"||n.key==="master") && <span style={{marginLeft:"auto", fontSize:9, letterSpacing:"0.04em", color:"#E8B4B8", fontWeight:700}}>管理者</span>}
              </button>
            )
          })}
        </nav>

        {/* ユーザー切り替え（モック用） */}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)", padding:"12px 16px"}}>
          <div style={{fontSize:10, fontWeight:700, color:"#595959", letterSpacing:"0.08em", marginBottom:8}}>▶ モック：ユーザー切り替え</div>
          <select
            value={currentUserId}
            onChange={e=>handleUserSwitch(e.target.value)}
            style={{width:"100%", background:"#2E2E30", border:"1px solid #3E3E40", color:C.sidebarText, fontSize:12, padding:"6px 8px", fontFamily:"inherit", cursor:"pointer"}}
          >
            {users.filter(u=>u.active).map(u=>(
              <option key={u.id} value={u.id}>{u.name}（{ROLES[u.role].label}）</option>
            ))}
          </select>
          <div style={{marginTop:8, display:"flex", alignItems:"center", gap:6}}>
            <div style={{width:24, height:24, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0}}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div style={{fontSize:12, fontWeight:700, color:C.sidebarActive, lineHeight:"1.3"}}>{currentUser.name}</div>
              <StatusBadge cfg={ROLES[currentRole]} />
            </div>
          </div>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main style={{flex:1, overflowY:"auto", background:C.bg}}>
        {view==="dashboard"  && <Dashboard  {...p} />}
        {view==="customers"  && <Customers  {...p} />}
        {view==="staging"    && <StagingReview staging={staging} setStaging={setStaging} setCustomers={setCustomers} users={users} />}
        {view==="brands"     && <Brands     {...p} />}
        {view==="deals"      && <Deals      {...p} />}
        {view==="activities" && <Activities {...p} />}
        {view==="tasks"      && <Tasks      {...p} />}
        {view==="users"      && currentRole==="admin" && <UserManagement users={users} setUsers={setUsers} currentRole={currentRole} />}
        {view==="master"     && currentRole==="admin" && <MasterManagement plans={plans} setPlans={setPlans} />}
      </main>
    </div>
  )
}
