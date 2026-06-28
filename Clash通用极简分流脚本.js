// Clash极简分流脚本(过滤香港台湾两类限制较多的节点)
const EXCLUDE_KEYWORDS_PATTERN = "邀请返佣|重新从网站获取订阅|公告信息|重置|套餐|剩余|到期|主页|官网|游戏|关注|网站|网址|地址|有效|香港|Hongkong|HK|台湾|台北|Taiwan|TW|禁止|邮箱|发布|客服|订阅|节点|问题|联系|https?:\\/\\/|\\.[a-z]{2,}";
const globalExcludeKeywords = new RegExp(`(${EXCLUDE_KEYWORDS_PATTERN})`, "i");

function main(params) {
    if (!params || !params.proxies || !Array.isArray(params.proxies)) {
        console.error("Invalid params or proxies not found");
        return params;
    }
    const beforeCount = params.proxies.length;
    params.proxies = params.proxies.filter(p => !globalExcludeKeywords.test(p.name));
    const filteredCount = beforeCount - params.proxies.length;
    if (filteredCount > 0) {
        console.log(`已过滤 ${filteredCount} 个无效节点`);
    }
    try {
        overwriteBasicOptions(params);
        overwriteDns(params);
        overwriteFakeIpFilter(params);
        overwriteNameserverPolicy(params);
        overwriteHosts(params);
        overwriteTunnel(params);
        overwriteProxyGroups(params);
        overwriteRules(params);
        console.log("Configuration loaded successfully");
    } catch (error) {
        console.error("Script execution failed:", error);
    }
    return params;
}

function overwriteBasicOptions(params) {
    const otherOptions = {
        "mixed-port": 7897,
        "allow-lan": true,
        mode: "rule",
        "log-level": "warning",
        ipv6: false,
        "find-process-mode": "off",
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        "unified-delay": true,
        "tcp-concurrent": true,
        "global-client-fingerprint": "chrome",
        sniffer: {
            enable: true,
            sniff: {
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
                TLS: {
                    ports: [443, 8443],
                    "override-destination": true,
                },
                QUIC: {
                    ports: [443, 8443],
                },
            },
            "skip-domain": ["+.mesh.mihome.io", "+.push.apple.com", "+.push.googleapis.com", "+.mtalk.google.com"]
        },
    };
    Object.keys(otherOptions).forEach((key) => {
        params[key] = otherOptions[key];
    });
}

function overwriteDns(params) {
    const dnsList = [
        "https://223.5.5.5/dns-query",
        "https://doh.pub/dns-query",
    ];
    const proxyDnsList = [
        "223.5.5.5",
        "119.29.29.29",
    ];
    const dnsOptions = {
        enable: true,
        "prefer-h3": false,
        ipv6: false,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        nameserver: dnsList,
        "proxy-server-nameserver": proxyDnsList,
        fallback: [
            "https://1.1.1.1/dns-query",
            "https://dns.google/dns-query"
        ],
        "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    };
    params.dns = { ...dnsOptions };
}

function overwriteFakeIpFilter(params) {
    const fakeIpFilter = [
        "*.m2m", "*.bogon", "*.lan", "*.local", "*.internal", "*.localdomain",
        "+.injections.adguard.org", "+.local.adguard.org", "+.home.arpa",
        "dns.msftncsi.com", "*.srv.nintendo.net", "*.stun.playstation.net",
        "xbox.*.microsoft.com", "*.xboxlive.com", "*.turn.twilio.com",
        "*.stun.twilio.com", "stun.syncthing.net", "stun.*", "*.sslip.io",
        "*.nip.io", "*.example.com", "+.internal.corp"
    ];
    params.dns["fake-ip-filter"] = fakeIpFilter;
}

function overwriteNameserverPolicy(params) {
    const nameserverPolicy = {
        "+.securelogin.com.cn": "system",
        "captive.apple.com": "system",
        "hotspot.cslwifi.com": "system",
        "*.m2m": "system",
        "injections.adguard.org": "system",
        "local.adguard.org": "system",
        "*.bogon": "system",
        "*.home": "system",
        "instant.arubanetworks.com": "system",
        "setmeup.arubanetworks.com": "system",
        "router.asus.com": "system",
        "repeater.asus.com": "system",
        "+.asusrouter.com": "system",
        "+.routerlogin.net": "system",
        "+.routerlogin.com": "system",
        "+.tplinkwifi.net": "system",
        "+.tplogin.cn": "system",
        "+.tplinkap.net": "system",
        "+.tplinkmodem.net": "system",
        "+.tplinkplclogin.net": "system",
        "+.tplinkrepeater.net": "system",
        "*.ui.direct": "system",
        "unifi": "system",
        "*.huaweimobilewifi.com": "system",
        "*.router": "system",
        "aterm.me": "system",
        "console.gl-inet.com": "system",
        "homerouter.cpe": "system",
        "mobile.hotspot": "system",
        "ntt.setup": "system",
        "pi.hole": "system",
        "*.plex.direct": "system",
        "+.10.in-addr.arpa": "system",
        "+.16.172.in-addr.arpa": "system",
        "+.17.172.in-addr.arpa": "system",
        "+.18.172.in-addr.arpa": "system",
        "+.19.172.in-addr.arpa": "system",
        "+.20.172.in-addr.arpa": "system",
        "+.21.172.in-addr.arpa": "system",
        "+.22.172.in-addr.arpa": "system",
        "+.23.172.in-addr.arpa": "system",
        "+.24.172.in-addr.arpa": "system",
        "+.25.172.in-addr.arpa": "system",
        "+.26.172.in-addr.arpa": "system",
        "+.27.172.in-addr.arpa": "system",
        "+.28.172.in-addr.arpa": "system",
        "+.29.172.in-addr.arpa": "system",
        "+.30.172.in-addr.arpa": "system",
        "+.31.172.in-addr.arpa": "system",
        "+.168.192.in-addr.arpa": "system",
        "+.254.169.in-addr.arpa": "system",
        "*.lan": "system",
        "*.local": "system",
        "*.internal": "system",
        "*.localdomain": "system",
        "+.home.arpa": "system"
    };
    params.dns["nameserver-policy"] = nameserverPolicy;
}

function overwriteHosts(params) {
    const hosts = {
        "dns.alidns.com": ['223.5.5.5', '223.6.6.6', '2400:3200:baba::1', '2400:3200::1'],
        "doh.pub": ['120.53.53.53', '1.12.12.12'],
        "cdn.jsdelivr.net": "cdn.jsdelivr.net.cdn.cloudflare.net"
    };
    params.hosts = hosts;
}

function overwriteTunnel(params) {
    const tunnelOptions = {
        enable: true,
        stack: "mixed",
        device: "TUN",
        "dns-hijack": ["any:53"],
        "auto-route": true,
        "auto-detect-interface": true,
        "strict-route": false,
        "route-exclude-address": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "100.64.0.0/10"],
    };
    params.tun = { ...tunnelOptions };
}

function overwriteProxyGroups(params) {
    const allProxies = params["proxies"].map((e) => e.name);
    const excludePattern = EXCLUDE_KEYWORDS_PATTERN;
    const includeTerms = {
        HK: "(香港|HK|Hong|🇭🇰)",
        TW: "(台湾|TW|Taiwan|Wan|🇹🇼|🇨🇳)",
        SG: "(新加坡|狮城|SG|Singapore|🇸🇬)",
        JP: "(日本|JP|Japan|🇯🇵)",
        KR: "(韩国|韓|KR|Korea|🇰🇷)",
        US: "(美国|US|United States|America|🇺🇸)",
        UK: "(英国|UK|United Kingdom|🇬🇧)",
        FR: "(法国|FR|France|🇫🇷)",
        DE: "(德国|DE|Germany|🇩🇪)",
    };
    const autoProxyGroupRegexs = [
        { name: "HK-自动", regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludePattern}).*$`, "i"), isMain: true },
        { name: "TW-自动", regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludePattern}).*$`, "i"), isMain: true },
        { name: "SG-自动", regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludePattern}).*$`, "i"), isMain: true },
        { name: "JP-自动", regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludePattern}).*$`, "i"), isMain: true },
        { name: "KR-自动", regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludePattern}).*$`, "i"), isMain: false },
        { name: "US-自动", regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludePattern}).*$`, "i"), isMain: true },
        { name: "UK-自动", regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludePattern}).*$`, "i"), isMain: false },
        { name: "FR-自动", regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludePattern}).*$`, "i"), isMain: false },
        { name: "DE-自动", regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludePattern}).*$`, "i"), isMain: false },
        { name: "0.x-自动", regex: new RegExp(`^(?=.*(?:^|[^0-9])0\\.[1-9](?:$|[^0-9]))(?!.*${excludePattern}).*$`, "i"), isMain: false },
    ];
    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => {
            const baseConfig = {
                name: item.name,
                type: "url-test",
                url: "https://cp.cloudflare.com/generate_204",
                interval: 900,
                tolerance: 50,
                proxies: getProxiesByRegex(params, item.regex),
                hidden: true,
            };
            if (!item.isMain) {
                baseConfig.lazy = true;
            }
            return baseConfig;
        })
        .filter((item) => item.proxies.length > 0);
    
    const manualProxyGroups = [
        {
            name: "HK-手动",
            regex: new RegExp(`^(?=.*${includeTerms.HK})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/HKflag.png"
        },
        {
            name: "TW-手动",
            regex: new RegExp(`^(?=.*${includeTerms.TW})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/TWflag.png"
        },
        {
            name: "JP-手动",
            regex: new RegExp(`^(?=.*${includeTerms.JP})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/JPflag.png"
        },
        {
            name: "SG-手动",
            regex: new RegExp(`^(?=.*${includeTerms.SG})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/SGflag.png"
        },
        {
            name: "US-手动",
            regex: new RegExp(`^(?=.*${includeTerms.US})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/USflag.png"
        },
        {
            name: "KR-手动",
            regex: new RegExp(`^(?=.*${includeTerms.KR})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/KRflag.png"
        },
        {
            name: "UK-手动",
            regex: new RegExp(`^(?=.*${includeTerms.UK})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/UKflag.png"
        },
        {
            name: "FR-手动",
            regex: new RegExp(`^(?=.*${includeTerms.FR})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/FRflag.png"
        },
        {
            name: "DE-手动",
            regex: new RegExp(`^(?=.*${includeTerms.DE})(?!.*${excludePattern}).*$`, "i"),
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/DEflag.png"
        }
    ];
    const manualProxyGroupsConfig = manualProxyGroups
        .map((item) => ({
            name: item.name,
            type: "select",
            proxies: getProxiesByRegex(params, item.regex),
            icon: item.icon,
            hidden: false,
        }))
        .filter((item) => item.proxies.length > 0);
    const safeAllProxies = allProxies.length > 0 ? allProxies : ["DIRECT"];
    const groups = [
        {
            name: "Proxy",
            type: "select",
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/Proxy.png",
            proxies: ["Auto", "Select", "DIRECT"],
        },
        {
            name: "Auto",
            type: "select",
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/Auto.png",
            proxies: ["All-自动", "HK-自动", "TW-自动", "JP-自动", "SG-自动", "US-自动", "KR-自动", "UK-自动", "FR-自动", "DE-自动", "0.x-自动"],
        },
        {
            name: "Select",
            type: "select",
            icon: "https://cdn.jsdelivr.net/gh/Alex-repositories/icons_02@main/Select.png",
            proxies: safeAllProxies,
        },
        {
            name: "All-自动",
            type: "url-test",
            url: "https://cp.cloudflare.com/generate_204",
            interval: 900,
            tolerance: 50,
            proxies: safeAllProxies,
            hidden: true,
        }
    ];
    
    groups.push(...autoProxyGroups);
    groups.push(...manualProxyGroupsConfig);
    params["proxy-groups"] = groups;
}

function overwriteRules(params) {
    const rules = [
        // 基础广告拦截
        "RULE-SET,reject_non_ip,REJECT",
        "RULE-SET,reject_domainset,REJECT",
        "RULE-SET,reject_ip,REJECT",
        // 局域网直连
        "RULE-SET,lan_non_ip,DIRECT",
        "RULE-SET,lan_ip,DIRECT",
        // 国内域名/IP直连
        "RULE-SET,domestic_non_ip,DIRECT",
        "RULE-SET,domestic_ip,DIRECT",
        "RULE-SET,china_ip,DIRECT",
        // 其余全部走代理
        "MATCH,Proxy"
    ];
    params.rules = rules;

    const ruleProviders = {
        reject_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/reject.txt",
            path: "./rule_set/sukkaw_ruleset/reject_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        reject_domainset: {
            type: "http",
            behavior: "domain",
            url: "https://ruleset.skk.moe/Clash/domainset/reject.txt",
            path: "./rule_set/sukkaw_ruleset/reject_domainset.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        reject_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/reject.txt",
            path: "./rule_set/sukkaw_ruleset/reject_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        domestic_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/domestic.txt",
            path: "./rule_set/sukkaw_ruleset/domestic_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        domestic_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/domestic.txt",
            path: "./rule_set/sukkaw_ruleset/domestic_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        china_ip: {
            type: "http",
            behavior: "ipcidr",
            url: "https://ruleset.skk.moe/Clash/ip/china_ip.txt",
            path: "./rule_set/sukkaw_ruleset/china_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        lan_non_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/non_ip/lan.txt",
            path: "./rule_set/sukkaw_ruleset/lan_non_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        },
        lan_ip: {
            type: "http",
            behavior: "classical",
            url: "https://ruleset.skk.moe/Clash/ip/lan.txt",
            path: "./rule_set/sukkaw_ruleset/lan_ip.txt",
            interval: 43200,
            format: "text",
            proxy: "Proxy"
        }
    };
    params["rule-providers"] = ruleProviders;
}

function getProxiesByRegex(params, regex, fallbackToDirect = true) {
    const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
    if (matchedProxies.length > 0) return matchedProxies;
    return fallbackToDirect ? ["DIRECT"] : [];
}
