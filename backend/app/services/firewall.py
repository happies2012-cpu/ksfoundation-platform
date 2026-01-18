
from typing import List, Dict, Union
from pydantic import BaseModel

class FirewallRule(BaseModel):
    direction: str = "IN" # IN, OUT
    protocol: str = "tcp"
    port: Union[int, str]
    action: str = "ALLOW" # ALLOW, DENY
    source_ip: str = "0.0.0.0/0"
    comment: str = ""

class FirewallService:
    """
    Generates Firewall configurations.
    Translates intents to UFW/IPTables commands.
    """

    def generate_ufw_commands(self, rules: List[FirewallRule]) -> List[str]:
        commands = ["ufw --force reset", "ufw default deny incoming", "ufw default allow outgoing"]
        
        for rule in rules:
            cmd = f"ufw {rule.action.lower()}"
            if rule.direction == "IN":
                cmd += f" from {rule.source_ip}"
            
            if str(rule.port).lower() != "any":
                cmd += f" to any port {rule.port} proto {rule.protocol}"
            
            if rule.comment:
                cmd += f" comment '{rule.comment}'"
                
            commands.append(cmd)
            
        commands.append("ufw --force enable")
        return commands

    def block_country_commands(self, country_code: str) -> List[str]:
        """
        Generates commands to block IPs from a specific country using ipsets.
        """
        # In a real app, this would download IP blocks from maxmind or ipdeny
        return [
            "apt-get install -y ipset",
            f"ipset create country_{country_code} hash:net",
            f"# Simulate adding IPs for {country_code}",
            f"iptables -I INPUT -m set --match-set country_{country_code} src -j DROP"
        ]

firewall_service = FirewallService()
