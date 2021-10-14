#!/bin/bash

# Usage: AURORA_HOST=... JUMP_IP=... ./migrateAurora.sh
ssh -N -L 5432:${AURORA_HOST}:5432 ubuntu@${JUMP_IP} -i prismaJumpbox.pem -v
