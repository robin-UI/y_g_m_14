'use client';

class PeerService {
  public peer!: RTCPeerConnection;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== "undefined") {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:3478",
              "stun:stun.l.google.com:5349",
              "stun:stun1.l.google.com:5349",
              "stun:stun2.l.google.com:19302",
              "stun:stun2.l.google.com:5349",
              "stun:stun3.l.google.com:3478",
              "stun:stun3.l.google.com:5349",
              "stun:stun4.l.google.com:19302",
              "stun:stun4.l.google.com:5349"
            ],
          },
        ],
      });
    }
  }

  // Reset the peer connection (useful when starting a new call)
  resetPeerConnection() {
    if (typeof window === "undefined") return;

    // Close existing connection if it exists
    if (this.peer) {
      this.peer.close();
    }

    // Create a new peer connection
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:3478",
            "stun:stun.l.google.com:5349",
            "stun:stun1.l.google.com:5349",
            "stun:stun2.l.google.com:19302",
            "stun:stun2.l.google.com:5349",
            "stun:stun3.l.google.com:3478",
            "stun:stun3.l.google.com:5349",
            "stun:stun4.l.google.com:19302",
            "stun:stun4.l.google.com:5349"
          ],
        },
      ],
    });
  }

  async getAnswer(offer: RTCSessionDescriptionInit) {
    if (!this.peer) return null;
    await this.peer.setRemoteDescription(offer);
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (!this.peer) return null;
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }
}

const peerService = new PeerService();
export default peerService;
