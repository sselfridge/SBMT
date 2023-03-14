# SBMT
beta of dotnet for sbmt server


#port forwarding handled used nginx / certbot

https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/

not 100% sure this is how things are setup, but its a jumping off point.
Remind Me: When doing tricky config stuff, write down the thing that actually worked.


# old method using iptables port forwarding

port forwarding on server:
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 5000
iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 5001

View existing:
iptables -L -t nat

https://superuser.com/questions/523290/what-is-command-to-look-list-of-redirect-rules-iptables

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/www.sbmtchallenge.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/www.sbmtchallenge.com/privkey.pem

