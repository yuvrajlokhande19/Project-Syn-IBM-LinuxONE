# 📓 Project Syn — IBM LinuxONE (s390x) JupyterLab Notebook Suite

Welcome to the **Project Syn Scientific & Algorithmic Validation Suite**. These interactive Jupyter Notebooks demonstrate the end-to-end data pipelines, AI models, deterministic routing algorithms, and hardware-accelerated cryptographic checks running natively on **IBM LinuxONE (s390x)**.

---

## 🗺️ Notebook Architecture Directory

| Notebook | Focus Area | Technology Stack | Key Output / Benchmark |
| :--- | :--- | :--- | :--- |
| **[`00_START_HERE_Project_Syn_Mainframe_Architecture.ipynb`](00_START_HERE_Project_Syn_Mainframe_Architecture.ipynb)** | s390x Hardware & Big-Endian Verification | `platform`, `sys`, Linux `/proc/cpuinfo`, CPACF | Hardware crypto flags (`nnpa`, `cpacf`), Big-Endian byte confirmation |
| **[`01_Mumbai_OpenData_Ingestion_Pipeline.ipynb`](01_Mumbai_OpenData_Ingestion_Pipeline.ipynb)** | Real-world Open Data Harvesting & Sensor Stream | OpenCity CKAN API (`8d1c157e-9cee-4bae-a434-f1e6319edf32`), Pandas | Real Mumbai hospital telemetry synthesis (KEM, Tata Memorial, Sion, Nair) |
| **[`02_SnapML_RandomForest_Anomaly_Detection.ipynb`](02_SnapML_RandomForest_Anomaly_Detection.ipynb)** | Safety-Bounded ML Inference | IBM Snap ML (`snapml.RandomForestClassifier`), Scikit-Learn | **<0.8ms inference latency**, ICU bed exhaustion & flood surge detection |
| **[`03_Dijkstra_Emergency_Corridor_Routing.ipynb`](03_Dijkstra_Emergency_Corridor_Routing.ipynb)** | Deterministic Green Corridor Pathfinder | NetworkX, Weighted Dijkstra Graph Solver | Real-time dynamic route rerouting around flooded underpasses |
| **[`04_CPACF_Hardware_HMAC_Verification.ipynb`](04_CPACF_Hardware_HMAC_Verification.ipynb)** | Wire-Speed Zero-Trust Security Gate | Python `hmac`, `hashlib.sha256`, CPACF Native Crypto | 10,000-packet spoof injection benchmark, 100% rejection of tampered packets |

---

## 🚀 Running on IBM LinuxONE Cloud (Marist)

### Accessing via Browser
JupyterLab runs inside a certified s390x container (`registry.linuxone.cloud.marist.edu/l1cc/jupyterlab-image-s390x:latest`):
```bash
URL: http://148.100.79.88:38888/?token=Your_Token1
Mount Path: /home/ibm-user/shared/
```

### Headless Kernel Execution
You can also run any notebook end-to-end from the terminal:
```bash
jupyter nbconvert --to notebook --execute 02_SnapML_RandomForest_Anomaly_Detection.ipynb
```
