---
title: "KEDA Deep Dive: Scaling on Real Metrics from Dynatrace and AWS AMP"
date: 2026-06-18
description: "How to wire KEDA to two independent metric sources — Dynatrace Metrics v2 and AWS AMP Prometheus — plus a Cron floor, on EKS with FluxCD GitOps."
tags: ["KEDA", "Kubernetes", "EKS", "Dynatrace", "GitOps", "FluxCD"]
draft: false
---

Most KEDA tutorials show CPU or memory scaling. That's autoscaling with training wheels.
Real platform work means scaling on business metrics: queue depth, active users, error rates —
signals that actually matter.

This post walks through wiring KEDA to two independent metric sources on EKS:
AWS AMP (Prometheus), Dynatrace Metrics v2, and a Cron scaler as a night floor.

## Architecture

EKS cluster, KEDA operator, FluxCD for GitOps, Dynatrace OneAgent on every node, AWS Managed
Prometheus for custom app metrics. KEDA polls each scaler independently — the maximum desired
replica count across all triggers wins.

## The ScaledObject

```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: my-service
spec:
  scaleTargetRef:
    name: my-service        # matches the Deployment's app label — NOT the Helm release name
  minReplicaCount: 2
  maxReplicaCount: 20
  triggers:
    - type: prometheus
      metadata:
        serverAddress: https://aps-workspaces.eu-north-1.amazonaws.com/workspaces/<id>
        query: sum(rate(http_requests_total{job="my-service"}[2m]))
        threshold: "100"
    - type: dynatrace
      metadata:
        host: https://<tenant>.live.dynatrace.com
        metricSelector: builtin:service.requestCount.total
        threshold: "500"
    - type: cron
      metadata:
        timezone: Europe/Stockholm
        start: 0 22 * * *
        end: 0 6 * * *
        desiredReplicas: "2"
```

## Key Lessons

**`scaleTargetRef.name` is the app label, not the Helm release name.** The target must match the
Deployment's `app` label — this breaks silently if wrong.

**Cron as a floor, not a ceiling.** Use Cron to guarantee a minimum overnight.
Let metric scalers drive the real work during the day.

**Secrets via External Secrets Operator.** Dynatrace and AMP credentials go in AWS Secrets Manager,
surfaced via ESO. Never inline API tokens in the ScaledObject.

This setup has been running in production for over a year — 99.99% uptime through traffic spikes.
