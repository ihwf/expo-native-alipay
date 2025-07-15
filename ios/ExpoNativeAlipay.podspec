require "json"

package = JSON.parse(File.read(File.join(__dir__, '..', "package.json")))

Pod::Spec.new do |s|
  s.name           = "ExpoNativeAlipay"
  s.version        = package["version"]
  s.summary        = package["description"]
  s.description    = package["description"]
  s.license        = package["license"]
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = { :ios => "9.0" }
  s.swift_version  = '5.4'
  s.source         = { git: 'https://github.com/ihwf/expo-native-alipay' }
  s.static_framework = true
  
  s.dependency "ExpoModulesCore"
  s.resources = './AlipaySDK.bundle'
  s.vendored_frameworks = './AlipaySDK.framework'

  s.frameworks = ["UIKit", "Foundation", "CFNetwork", "SystemConfiguration", "QuartzCore", "CoreGraphics", "CoreMotion", "CoreTelephony", "CoreText", "WebKit"]
  s.libraries = ["c++", "z"]

    # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"
end
