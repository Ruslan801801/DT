Pod::Spec.new do |s|
s.name             = 'BLEModule'
s.version          = '0.0.1'
s.summary          = 'DeepTea BLE Module'
s.source           = { :git => 'https://example.com/blemodule.git', :tag => s.version }
s.platform         = :ios, '13.0'
s.requires_arc     = true
s.swift_version    = '5.0'
s.source_files     = 'BLEModule/**/*.{h,m,mm,swift}'
end