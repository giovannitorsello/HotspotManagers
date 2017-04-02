HS_INTERFACE="vboxnet0"
HS_IP="192.168.56.1"
HS_PORT="3000"
IPTABLES="/sbin/iptables"

WAN_INTERFACE="wlan0"

#Enable kernel forward
echo 1 > /proc/sys/net/ipv4/ip_forward

#reset rules
$IPTABLES -t nat -F
$IPTABLES -t filter -F
$IPTABLES -t mangle -F


#create chain HotSpot
#$IPTABLES -N hotspot

#Mark connection from uknown MAC address
$IPTABLES -t mangle -A PREROUTING -j MARK --set-mark 99


#NAT
$IPTABLES -t nat -A PREROUTING -m mark --mark 99 -m multiport -p tcp --dport 80,443 -j DNAT --to-destination $HS_IP:$HS_PORT
$IPTABLES -t nat -A POSTROUTING -o $WAN_INTERFACE -j MASQUERADE


#Allow connection only for local DNS and HHTP
$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -p tcp --dport $HS_PORT -j ACCEPT
$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -p udp --dport 53 -j ACCEPT
$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -p icmp  -j ACCEPT


#External DNS
$IPTABLES -t filter -A FORWARD -i $HS_INTERFACE -p udp --dport 53 -j ACCEPT


#Block connection for unsigned clients
$IPTABLES -t filter -A FORWARD -i $HS_INTERFACE -m mark --mark 99 -j DROP
$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -m mark --mark 99 -j DROP


