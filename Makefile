SERVICE_NAME=matter-display
SERVICE_FILE=/etc/systemd/system/$(SERVICE_NAME).service
LOCAL_SERVICE_FILE=matter-display.service

install:
	sed "s|/home/darren/Matter-Display|$(CURDIR)|g" $(LOCAL_SERVICE_FILE) > matter-display.tmp.service
	sudo cp matter-display.tmp.service $(SERVICE_FILE)
	rm matter-display.tmp.service
	sudo systemctl daemon-reload
	sudo systemctl enable $(SERVICE_NAME)
	sudo systemctl start $(SERVICE_NAME)
	@echo "Service $(SERVICE_NAME) installed and started with directory $(CURDIR)."

uninstall:
	sudo systemctl stop $(SERVICE_NAME)
	sudo systemctl disable $(SERVICE_NAME)
	sudo rm -f $(SERVICE_FILE)
	sudo systemctl daemon-reload
	@echo "Service $(SERVICE_NAME) removed."

status:
	sudo systemctl status $(SERVICE_NAME)

logs:
	sudo journalctl -u $(SERVICE_NAME) -f

restart:
	sudo systemctl restart $(SERVICE_NAME)
