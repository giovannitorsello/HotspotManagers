HS_INTERFACE="vboxnet0"
HS_IP="192.168.56.1"
IPTABLES="/sbin/iptables"

#reset rules
$IPTABLES -t nat -F
$IPTABLES -t filter -F
$IPTABLES -t mangle -F


#create chain HotSpot
#$IPTABLES -N hotspot

#Mark connection from uknown MAC address
#$IPTABLES -t mangle -A PREROUTING -j MARK --set-mark 99


#$IPTABLES -t nat -A PREROUTING -m mark --mark 99 -m multiport -p tcp --dport 80,443 -j DNAT --to-destination 192.168.56.1:3000

#Allow connection only for local DNS and HHTP
#$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -p tcp --dport 80 -j ACCEPT
#$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -p udp --dport 53 -j ACCEPT
#$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -p icmp  -j ACCEPT



#Block connection for unsigned clients
#$IPTABLES -t filter -A FORWARD -i $HS_INTERFACE -m mark --mark 99 -j DROP
#$IPTABLES -t filter -A INPUT -i $HS_INTERFACE -m mark --mark 99 -j DROP


