import { describe, it, expect, beforeEach } from 'vitest'
import { useCameraStore, CAMERA_MODES } from '../stores/useCameraStore'

describe('useCameraStore', () => {
  beforeEach(() => {
    useCameraStore.setState({
      mode: CAMERA_MODES.FIRST_PERSON,
      zoom: 1.0,
      azimuth: 315,
      pitch: 0,
      deskLampOn: true
    })
  })

  it('should switch between camera modes', () => {
    const store = useCameraStore.getState()
    store.setMode(CAMERA_MODES.SCOPE)
    expect(useCameraStore.getState().mode).toBe(CAMERA_MODES.SCOPE)

    store.setMode(CAMERA_MODES.THIRD_PERSON)
    expect(useCameraStore.getState().mode).toBe(CAMERA_MODES.THIRD_PERSON)

    store.setMode(CAMERA_MODES.CINEMATIC)
    expect(useCameraStore.getState().mode).toBe(CAMERA_MODES.CINEMATIC)
  })

  it('should clamp zoom level between 1.0 and 4.0', () => {
    const store = useCameraStore.getState()
    store.setZoom(0.5)
    expect(useCameraStore.getState().zoom).toBe(1.0)

    store.setZoom(5.5)
    expect(useCameraStore.getState().zoom).toBe(4.0)
  })

  it('should normalize azimuth and clamp pitch angles', () => {
    const store = useCameraStore.getState()
    store.setLookAngles(370, 75)
    expect(useCameraStore.getState().azimuth).toBe(10)
    expect(useCameraStore.getState().pitch).toBe(60)
  })

  it('should toggle desk lamp correctly', () => {
    const store = useCameraStore.getState()
    store.toggleDeskLamp()
    expect(useCameraStore.getState().deskLampOn).toBe(false)
  })
})
