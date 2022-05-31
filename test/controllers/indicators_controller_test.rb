require "test_helper"

class IndicatorsControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get indicators_edit_url
    assert_response :success
  end
end
