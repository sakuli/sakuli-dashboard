# Sakuli dashboard change log

## v2.1.0 (next)
### General
- [add CHANGELOG.md to repo](https://github.com/sakuli/sakuli-dashboard/issues/74)
- [Make default layout configurable](https://github.com/sakuli/sakuli-dashboard/issues/79)

### Fix
- [Info popover not shown in fullscreen](https://github.com/sakuli/sakuli-dashboard/issues/41)

## v2.0.1
### Features
- [add shm size to container](https://github.com/sakuli/pink-coffee/issues/33)

### Fix
- [Dont delete pod if not existing](https://github.com/sakuli/sakuli-dashboard/pull/72)

## v2.0.0
This release marks the step of the dashboard from an internal tool to a product that is part of the Sakuli ecosystem.
From here, the dashboard is shipped as a container available via dockerhub which requires a license token to boot up.

### Features
- [Add plugin validator to container startup](https://github.com/sakuli/sakuli-dashboard/issues/52)
- [Add CI](https://github.com/sakuli/sakuli-dashboard/issues/53)
- [Add continuous delivery (latest/release)](https://github.com/sakuli/sakuli-dashboard/issues/54)
- [Configure logging in deployments](https://github.com/sakuli/sakuli-dashboard/issues/26)
- [Make CLUSTER_CONFIG, ACTION_CONFIG, CRONJOB_CONFIG optional](https://github.com/sakuli/sakuli-dashboard/issues/65)
- [Added error logs in case of invalid config](https://github.com/sakuli/sakuli-dashboard/commit/b84d058f262131fcc59e1e38616ad94960c2f291)

### Enhancements
- [Improve UX/CSS](https://github.com/sakuli/sakuli-dashboard/issues/40)

## v1.4.0
### Enhancements
- [Improve UX/CSS](https://github.com/sakuli/sakuli-dashboard/issues/40)

## v1.3.0
### Feature
- [add container](https://github.com/sakuli/sakuli-dashboard/pull/50)

### Enhancements
- [Improve error messages](https://github.com/sakuli/sakuli-dashboard/issues/4)

### Fix
- [Added scheduled image import to base image](https://github.com/sakuli/sakuli-dashboard/pull/46)
- [display polling after button click](https://github.com/sakuli/sakuli-dashboard/pull/49)

## v1.2.0
### Features
- [Cronjobs (limit openshift pods to one concurrent pod)](https://github.com/sakuli/pink-coffee/issues/20)

## v1.1.0
### Features
- [Add "Fullscreen" button to screens](https://github.com/sakuli/sakuli-dashboard/issues/23)
- [Lokalisierung](https://github.com/sakuli/sakuli-dashboard/issues/35)
- [Info Buttons](https://github.com/sakuli/sakuli-dashboard/issues/36)

### Enhancements
- [Improve exception handling and logging](https://github.com/sakuli/sakuli-dashboard/issues/5)

## v1.0.4
### General
- [Added versioning instructions](https://github.com/sakuli/sakuli-dashboard/commit/971270b044db9a6b8c8292dc3aa36aef602445fa)

### Config
- [changed VNC View for all deployments to be read only](https://github.com/sakuli/sakuli-dashboard/commit/3dde14577cf4e6b93210608b760cd3df2e406c21)

## v1.0.3
### Config
- [CSS adjustments](https://github.com/sakuli/sakuli-dashboard/issues/19)
- [Changed description because Nico told me so](https://github.com/sakuli/sakuli-dashboard/commit/003f92e83ad82fcd545b69e2e62e0b56df7e5c8a)

## v1.0.2
### Config
- [Konfiguration Pink-Coffee Dashboard](https://github.com/sakuli/sakuli-dashboard/issues/21)

## v1.0.1
### Fix
- [changed deletePod promise type to void + added docs](https://github.com/sakuli/sakuli-dashboard/commit/6e687eb3341889c2786d4ce0ad86f6bbebe5bf3a)
- [Added logging + resolve delete pod promise in case of an error](https://github.com/sakuli/sakuli-dashboard/commit/7554601f165b128709fab2ebf51c9d559f0d22e2)

## v1.0.0

### Overview
The following features have been added:
- Shows multiple websites in configurable displays.
- It is possible to starts pods on a Kubernetes/OpenShift cluster.
- Configured display content is shown, if the target website is available.
- A placeholder is shown, if a display target is not available.
- If a display target becomes available the display is updated without reload.
- Added Templates for dashboard deployment on openshift.
- Added bootstrap script for easy setup.

### Features
- [Create Dashboard](https://github.com/sakuli/pink-coffee/issues/6)
- [Deploy dashboard and ensure availability](https://github.com/sakuli/pink-coffee/issues/7)
- [Action button - Start only one pod in cluster](https://github.com/sakuli/sakuli-dashboard/issues/9)
- [Application not available](https://github.com/sakuli/sakuli-dashboard/issues/14)
  
### Config
- [Enable HTTPS](https://github.com/sakuli/sakuli-dashboard/issues/10)
