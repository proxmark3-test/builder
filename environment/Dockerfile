# Taken from https://github.com/RfidResearchGroup/proxmark3/blob/master/docker/ubuntu-18.04/Dockerfile
# Deleted sudoers part, since I do not want to let user uscalate privileges

FROM ubuntu:18.04

ENV LANG C
ENV DEBIAN_FRONTEND noninteractive
# qtbase5-dev skipped
# python3 skipped, not yet searchable with pkg-config python3
RUN apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y --no-install-recommends git ca-certificates build-essential cmake pkg-config libreadline-dev gcc-arm-none-eabi libnewlib-dev libbz2-dev libbluetooth-dev libssl-dev && \
    apt-get clean

# Create rrg user
RUN useradd -ms /bin/bash rrg
RUN passwd -d rrg

USER rrg
WORKDIR "/home/rrg"

CMD ["/bin/bash"]
