HS_INTERFACE="vboxnet0"
HS_IP="192.168.56.1"
HS_PORT_HTTP="9080"
HS_PORT_HTTPS="9443"
HS_PORT_DNS="9053"
WAN_INTERFACE="wlan0"

HS_IP_DNS="10.10.10.104"

IPTABLES="/sbin/iptables"
IPSET="/sbin/ipset"


#Enable kernel forward
echo 1 > /proc/sys/net/ipv4/ip_forward

./stop_captive_portal.sh

#reset rules
$IPTABLES -t nat -F
$IPTABLES -t filter -F
$IPTABLES -t mangle -F

$IPSET -F
$IPSET -X

$IPSET -N signed iphash


#create chain HotSpot
#$IPTABLES -N hotspot

#Mark connection from uknown MAC address
$IPTABLES -t mangle -A PREROUTING -j MARK --set-mark 99


#HTTPS REDIRECT
$IPTABLES -t nat -A PREROUTING -i $HS_INTERFACE -m mark --mark 99 -p tcp --dport 443 -j DNAT --to-destination $HS_IP:$HS_PORT_HTTPS
#HTTP REDIRECT
$IPTABLES -t nat -A PREROUTING -i $HS_INTERFACE -m mark --mark 99 -p tcp --dport 80  -j DNAT --to-destination $HS_IP:$HS_PORT_HTTP



#NAT DNS REDIRECT
$IPTABLES -t nat -A PREROUTING -i $HS_INTERFACE -m mark --mark 99 -p udp --dport 53 -j DNAT --to-destination $HS_IP:$HS_PORT_DNS

#$IPTABLES -t nat -A POSTROUTING -s 192.168.56.1/24 -o $HS_INTERFACE -j SNAT --to-source 192.168.56.1
#$IPTABLES -t nat -A POSTROUTING -o $HS_INTERFACE -j SNAT --from  $HS_IP:$HS_PORT_DNS


#NAT Masquerade
$IPTABLES -t nat -A POSTROUTING -o $WAN_INTERFACE -j MASQUERADE


#Allow connection only for local DNS and HHTP
$IPTABLES -t filter -A INPUT   -i $HS_INTERFACE -d $HS_IP -p tcp --dport $HS_PORT_HTTPS -j ACCEPT
$IPTABLES -t filter -A INPUT   -i $HS_INTERFACE -d $HS_IP -p tcp --dport $HS_PORT_HTTP -j ACCEPT
$IPTABLES -t filter -A INPUT   -i $HS_INTERFACE -d $HS_IP -p udp --dport $HS_PORT_DNS -j ACCEPT
$IPTABLES -t filter -A INPUT   -i $HS_INTERFACE -d $HS_IP -p icmp  -j ACCEPT

#External DNS
#$IPTABLES -t filter -A FORWARD -i $HS_INTERFACE -p udp --dport 53 -j ACCEPT


#Allow signed
$IPTABLES -A FORWARD -m set --match-set signed src,dst -j ACCEPT

#Block connection for unsigned clients
$IPTABLES -t filter -A FORWARD -i $HS_INTERFACE -m mark --mark 99 -j DROP
$IPTABLES -t filter -A INPUT   -i $HS_INTERFACE -m mark --mark 99 -j DROP


