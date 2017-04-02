HS_INTERFACE="vboxnet0"
HS_IP="192.168.56.1"
IPTABLES="/sbin/iptables"
IPSET="/sbin/ipset"

#reset rules
$IPTABLES -t nat -F
$IPTABLES -t filter -F
$IPTABLES -t mangle -F

$IPSET -F
$IPSET -X

